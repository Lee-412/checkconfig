import React, { useCallback, useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { dbSchema, tableSchema } from "../../api/type";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const viewSchemaModal: React.FC<{
  schema: dbSchema;
  onClose: () => void;
  onSubmit: (replicateTable: tableSchema[]) => void;
  loading: boolean;
}> = ({ schema, onClose, onSubmit, loading }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [open] = useState(true);
  const [selectedFields, setSelectedFields] = useState<
    Record<string, string[]>
  >({});
  const [searchQuery, setSearchQuery] = useState("");

  const initializeDiagram = useCallback(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    let yOffset = 0;

    schema.databaseSchema.forEach((table, index) => {
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
  }, [schema, setNodes, setEdges]);

  useEffect(() => {
    if (open) {
      initializeDiagram();
    }
  }, [open, initializeDiagram]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleFieldToggle = (tableName: string, fieldName: string) => {
    setSelectedFields((prev) => {
      const tableFields = prev[tableName] || [];
      return {
        ...prev,
        [tableName]: tableFields.includes(fieldName)
          ? tableFields.filter((f) => f !== fieldName)
          : [...tableFields, fieldName],
      };
    });
  };

  const handleSelectAll = (tableName: string, columns: string[]) => {
    setSelectedFields((prev) => {
      const currentFields = prev[tableName] || [];
      const allSelected = columns.every((col) => currentFields.includes(col));
      return {
        ...prev,
        [tableName]: allSelected ? [] : [...columns], // Toggle all fields on/off
      };
    });
  };

  const handleSubmit = () => {
    const replicateTables: tableSchema[] = Object.keys(selectedFields)
      .map((tableName) => {
        const table = schema.databaseSchema.find(
          (t) => t.tableName === tableName
        );
        if (!table) return null;

        const selectedColumns = table.columns.filter((col) =>
          (selectedFields[tableName] || []).includes(col.name)
        );

        if (selectedColumns.length === 0) return null;

        return {
          tableName: table.tableName,
          columns: selectedColumns,
        };
      })
      .filter((table): table is tableSchema => table !== null);

    onSubmit(replicateTables);
  };

  const filteredTables = schema.databaseSchema.filter((table) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>{schema.databaseName}</DialogTitle>
        </DialogHeader>
        <div className="flex" style={{ height: "600px" }}>
          <div style={{ width: "70%", height: "100%" }}>
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

          <div
            style={{
              width: "30%",
              padding: "16px",
              background: "#f9fafb",
              borderLeft: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Replicate Tables</h3>
              <Input
                placeholder="Search tables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full mb-2"
              />
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredTables.map((table) => {
                const selectedCount = (selectedFields[table.tableName] || [])
                  .length;
                const allColumns = table.columns.map((col) => col.name);
                const allSelected =
                  selectedCount > 0 &&
                  allColumns.every((col) =>
                    (selectedFields[table.tableName] || []).includes(col)
                  );

                return (
                  <div
                    key={table.tableName}
                    className="p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() =>
                        handleSelectAll(table.tableName, allColumns)
                      }
                    >
                      <div className="flex items-center">
                        <span className="mr-2">📋</span>
                        <strong>{table.tableName}</strong>
                      </div>
                      <span className="text-sm text-gray-500">
                        {selectedCount}/{table.columns.length}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <label className="flex items-center text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={() =>
                            handleSelectAll(table.tableName, allColumns)
                          }
                          onClick={(e) => e.stopPropagation()}
                          className="mr-2"
                          disabled={loading}
                        />
                        Select All
                      </label>
                      {table.columns.map((col) => (
                        <label
                          key={col.name}
                          className="flex items-center text-sm hover:bg-gray-100 p-1 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={(
                              selectedFields[table.tableName] || []
                            ).includes(col.name)}
                            onChange={() =>
                              handleFieldToggle(table.tableName, col.name)
                            }
                            onClick={(e) => e.stopPropagation()} // Prevent parent click
                            className="mr-2"
                            disabled={loading}
                          />
                          <span className="flex-1">
                            {col.constraints.includes("PRIMARY KEY") && (
                              <span className="mr-1" title="Primary Key">
                                🔑
                              </span>
                            )}
                            {col.name}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ({col.type})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default viewSchemaModal;
