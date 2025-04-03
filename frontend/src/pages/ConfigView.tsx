// ConfigViewPage.tsx
import React, { useState, useEffect } from "react";
import {
  useGetConfig,
  useGetTableConfig,
  useGetSchema,
  usePreviewData,
} from "../hooks/useSigninQueries";
import { TableData, tableSchema } from "../api/type";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import { Input } from "../components/ui/input";
import LoadingBar from "../components/LoadingBar"; // Import the new component

const ConfigViewPage: React.FC = () => {
  const {
    data: dbConfigArray,
    isLoading: dbLoading,
    error: dbError,
  } = useGetConfig();
  const {
    data: tableConfigArray,
    isLoading: tableLoading,
    error: tableError,
  } = useGetTableConfig();

  const dbConfig = dbConfigArray?.[0];
  const tableConfig = tableConfigArray?.[0];

  const {
    mutate: fetchSchema,
    data: schemaData,
    isPending: schemaLoading,
    error: schemaError,
  } = useGetSchema();
  const {
    mutate: fetchPreviewData,
    data: previewData,
    isPending: previewLoading,
    error: previewError,
  } = usePreviewData();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [columnWidths, setColumnWidths] = useState<
    Record<string, Record<string, number>>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    direction: "asc" | "desc" | null;
  }>({ column: null, direction: null });

  useEffect(() => {
    if (dbConfig?.id) {
      fetchSchema({ ...dbConfig, tableIncludeList: [] });
      fetchPreviewData({
        connectionString: dbConfig.connectionString,
        tables: dbConfig.tableIncludeList || [],
      });
    }
  }, [dbConfig, fetchSchema, fetchPreviewData]);

  useEffect(() => {
    if (previewData) console.log("Preview Data Updated:", previewData);
  }, [previewData]);

  const initializeDiagram = () => {
    if (!schemaData?.databaseSchema) return;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let yOffset = 0;

    schemaData.databaseSchema.forEach((table: tableSchema, index: number) => {
      const tableNode: Node = {
        id: table.tableName,
        position: { x: index * 300, y: yOffset },
        data: {
          label: (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ marginRight: "4px" }}>📋</span>
                <strong>{table.tableName}</strong>
              </div>
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span>
                    {col.constraints.includes("PRIMARY KEY") && (
                      <span style={{ marginRight: "4px" }}>🔑</span>
                    )}
                    {col.name}
                  </span>
                  <span style={{ color: "#888" }}>{col.type}</span>
                </div>
              ))}
            </div>
          ),
        },
        style: {
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "10px 15px",
          width: 200,
          fontSize: "12px",
        },
      };
      newNodes.push(tableNode);

      table.columns.forEach((col) => {
        if (col.referenceTo) {
          const edge: Edge = {
            id: `${col.name}-${col.referenceTo.tableName}`,
            source: table.tableName,
            target: col.referenceTo.tableName,
            animated: true,
            style: { stroke: "#ff0072" },
          };
          newEdges.push(edge);
        }
      });

      yOffset += 200;
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  useEffect(() => {
    if (schemaData) initializeDiagram();
  }, [schemaData]);

  const onConnect = (params: Edge | Connection) =>
    setEdges((eds) => addEdge(params, eds));

  useEffect(() => {
    if (!previewData || previewData.length === 0) return;

    const initialWidths: Record<string, Record<string, number>> = {};
    previewData.forEach((table: TableData) => {
      if (table.rows.length > 0) {
        const columns = Object.keys(table.rows[0]);
        initialWidths[table.tableName] = columns.reduce((acc, column) => {
          acc[column] = 150;
          return acc;
        }, {} as Record<string, number>);
      }
    });
    setColumnWidths(initialWidths);

    if (!selectedTable && previewData.length > 0) {
      setSelectedTable(previewData[0].tableName);
    }
  }, [previewData, selectedTable]);

  const handleResize =
    (tableName: string, column: string) =>
    (_e: any, { size }: { size: { width: number } }) => {
      setColumnWidths((prev) => ({
        ...prev,
        [tableName]: {
          ...prev[tableName],
          [column]: Math.max(size.width, 0),
        },
      }));
    };

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredPreviewData = previewData?.filter((table: TableData) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTableData = previewData?.find(
    (table: TableData) => table.tableName === selectedTable
  );

  const sortedRows = selectedTableData?.rows
    .slice()
    .sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
      if (!sortConfig.column || !sortConfig.direction) return 0;
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const isLoading =
    dbLoading || tableLoading || schemaLoading || previewLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <LoadingBar isLoading={isLoading} />

      {(dbError || tableError || schemaError || previewError) && (
        <div className="p-6 text-red-600">
          {dbError && <p>Error loading database config: {dbError.message}</p>}
          {tableError && (
            <p>Error loading table config: {tableError.message}</p>
          )}
          {schemaError && <p>Error loading schema: {schemaError.message}</p>}
          {previewError && (
            <p>Error loading preview data: {previewError.message}</p>
          )}
        </div>
      )}

      {!isLoading &&
        !(dbError || tableError || schemaError || previewError) && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Database Configuration
                </h2>
                {dbConfig ? (
                  <div className="space-y-3">
                    {Object.entries({
                      URI: dbConfig.uri,
                      Host: dbConfig.host,
                      Port: dbConfig.port,
                      Username: dbConfig.databaseUsername,
                      "Database Type": dbConfig.databaseType,
                      "SSL Mode": dbConfig.sslMode,
                      "Connection String": dbConfig.connectionString,
                    }).map(([key, value]) => (
                      <p key={key} className="flex items-center text-sm">
                        <strong className="w-1/3 text-gray-700">{key}:</strong>
                        <span
                          className="w-2/3 text-gray-600 truncate"
                          title={String(value)}
                        >
                          {String(value)}
                        </span>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No database configuration available.
                  </p>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Table Configuration
                </h2>
                {tableConfig ? (
                  <div className="space-y-3">
                    {Object.entries({
                      Table: tableConfig.userTable,
                      "Username Attribute": tableConfig.usernameAttribute,
                      "Password Attribute": tableConfig.passwordAttribute,
                      "Hashing Type": tableConfig.hashingType,
                      Salt: tableConfig.salt,
                    }).map(([key, value]) => (
                      <p key={key} className="flex items-center text-sm">
                        <strong className="w-1/3 text-gray-700">{key}:</strong>
                        <span className="w-2/3 text-gray-600">
                          {String(value)}
                        </span>
                      </p>
                    ))}
                    <div className="text-sm">
                      <strong className="text-gray-700">Hash Config:</strong>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-600 overflow-x-auto">
                        {JSON.stringify(tableConfig.hashConfig, null, 2)}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No table configuration available.
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Schema Relational Diagram
              </h2>
              {schemaData?.databaseSchema?.length > 0 ? (
                <div style={{ height: "400px" }}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    fitView
                  >
                    <MiniMap />
                    <Controls />
                    <Background />
                  </ReactFlow>
                </div>
              ) : (
                <p className="text-gray-500">No schema data available.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Preview Database
              </h2>
              <div className="flex" style={{ height: "400px" }}>
                <div className="w-1/4 bg-gray-50 p-4 overflow-y-auto border-r">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Tables
                  </h3>
                  <Input
                    placeholder="Search tables..."
                    value={searchQuery}
                    onChange={(e: {
                      target: { value: React.SetStateAction<string> };
                    }) => setSearchQuery(e.target.value)}
                    className="mb-3"
                  />
                  <div className="space-y-1">
                    {filteredPreviewData?.map((table: TableData) => (
                      <div
                        key={table.tableName}
                        className={`p-2 rounded cursor-pointer transition-colors ${
                          selectedTable === table.tableName
                            ? "bg-blue-100 text-blue-800 font-semibold"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedTable(table.tableName)}
                      >
                        <span className="mr-2">📋</span>
                        {table.tableName}
                        <span className="ml-2 text-xs text-gray-500">
                          ({table.rows.length} rows)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-3/4 flex flex-col p-4">
                  <div className="flex-1 overflow-y-auto">
                    {selectedTableData ? (
                      selectedTableData.rows.length > 0 ? (
                        <>
                          <div
                            className="flex justify

-between items-center mb-2"
                          >
                            <span className="text-sm text-gray-600">
                              Showing {selectedTableData.rows.length} rows and{" "}
                              {Object.keys(selectedTableData.rows[0]).length}{" "}
                              columns
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm">
                              <thead className="sticky top-0 bg-gray-100 z-10">
                                <tr>
                                  {Object.keys(selectedTableData.rows[0])
                                    .filter(
                                      (column) =>
                                        (columnWidths[
                                          selectedTableData.tableName
                                        ]?.[column] ?? 150) > 0
                                    )
                                    .map((column) => (
                                      <Resizable
                                        key={column}
                                        width={
                                          columnWidths[
                                            selectedTableData.tableName
                                          ]?.[column] ?? 150
                                        }
                                        height={0}
                                        onResize={handleResize(
                                          selectedTableData.tableName,
                                          column
                                        )}
                                        resizeHandles={["e"]}
                                        minConstraints={[50, 0]}
                                        maxConstraints={[500, 0]}
                                      >
                                        <th
                                          className="border p-2 text-left cursor-pointer hover:bg-gray-200"
                                          style={{
                                            width:
                                              columnWidths[
                                                selectedTableData.tableName
                                              ]?.[column] ?? 150,
                                          }}
                                          onClick={() => handleSort(column)}
                                        >
                                          {column}
                                          {sortConfig.column === column && (
                                            <span className="ml-1">
                                              {sortConfig.direction === "asc"
                                                ? "↑"
                                                : "↓"}
                                            </span>
                                          )}
                                        </th>
                                      </Resizable>
                                    ))}
                                </tr>
                              </thead>
                              <tbody>
                                {sortedRows?.map(
                                  (
                                    row: { [x: string]: any },
                                    index: number
                                  ) => (
                                    <tr
                                      key={index}
                                      className={`border ${
                                        index % 2 === 0
                                          ? "bg-white"
                                          : "bg-gray-50"
                                      } hover:bg-gray-100`}
                                    >
                                      {Object.keys(row)
                                        .filter(
                                          (column) =>
                                            (columnWidths[
                                              selectedTableData.tableName
                                            ]?.[column] ?? 150) > 0
                                        )
                                        .map((column, colIndex) => (
                                          <td
                                            key={colIndex}
                                            className="border p-2 truncate"
                                            style={{
                                              width:
                                                columnWidths[
                                                  selectedTableData.tableName
                                                ]?.[column] ?? 150,
                                              maxWidth:
                                                columnWidths[
                                                  selectedTableData.tableName
                                                ]?.[column] ?? 150,
                                            }}
                                            title={String(row[column])}
                                          >
                                            {String(row[column])}
                                          </td>
                                        ))}
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-500 flex-1 flex items-center justify-center">
                          No data available for this table.
                        </p>
                      )
                    ) : (
                      <p className="text-gray-500 flex-1 flex items-center justify-center">
                        Select a table to preview its data.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default ConfigViewPage;
