import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { TableData } from "../../api/type";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";

interface PreviewDataModalProps {
  previewData: TableData[];
  onSubmit: () => void;
  onClose: () => void;
  loading: boolean;
}

const PreviewDataModal: React.FC<PreviewDataModalProps> = ({
  previewData,
  onSubmit,
  onClose,
  loading,
}) => {
  const [open] = useState(true);
  const [selectedTable, setSelectedTable] = useState<string | null>(
    previewData.length > 0 ? previewData[0].tableName : null
  );
  const [columnWidths, setColumnWidths] = useState<
    Record<string, Record<string, number>>
  >({});
  const [hiddenColumns, setHiddenColumns] = useState<
    Record<string, Set<string>>
  >({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    direction: "asc" | "desc" | null;
  }>({ column: null, direction: null });

  useEffect(() => {
    const initialWidths: Record<string, Record<string, number>> = {};
    const initialHidden: Record<string, Set<string>> = {};
    previewData.forEach((table) => {
      if (table.rows.length > 0) {
        const columns = Object.keys(table.rows[0]);
        initialWidths[table.tableName] = columns.reduce((acc, column) => {
          acc[column] = 150;
          return acc;
        }, {} as Record<string, number>);
        initialHidden[table.tableName] = new Set();
      }
    });
    setColumnWidths(initialWidths);
    setHiddenColumns(initialHidden);
  }, [previewData]);

  const handleClose = () => {
    setSelectedTable(null);
    onClose();
  };

  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

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

      setHiddenColumns((prev) => {
        const hiddenSet = new Set(prev[tableName]);
        if (size.width <= 5) {
          hiddenSet.add(column); // Hide column if width is nearly 0
        } else {
          hiddenSet.delete(column); // Show column if width is increased
        }
        return { ...prev, [tableName]: hiddenSet };
      });
    };

  const handleSort = (column: string) => {
    setSortConfig((prev) => ({
      column,
      direction:
        prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredTables = previewData.filter((table) =>
    table.tableName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedTableData = previewData.find(
    (table) => table.tableName === selectedTable
  );

  const sortedRows = selectedTableData?.rows.slice().sort((a, b) => {
    if (!sortConfig.column || !sortConfig.direction) return 0;
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Preview Data View</DialogTitle>
        </DialogHeader>
        <div className="flex" style={{ height: "600px" }}>
          <div className="w-1/4 bg-gray-50 p-4 overflow-y-auto border-r">
            <h3 className="text-lg font-semibold mb-2">Tables</h3>
            <Input
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-3"
            />
            <div className="space-y-1">
              {filteredTables.map((table) => (
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
            {selectedTableData ? (
              selectedTableData.rows.length > 0 ? (
                <div className="flex-1 overflow-y-auto">
                  <div className="mb-2 text-sm text-gray-600">
                    Showing {selectedTableData.rows.length} rows and{" "}
                    {Object.keys(selectedTableData.rows[0]).length} columns
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                      <thead className="sticky top-0 bg-gray-100 z-10">
                        <tr>
                          {Object.keys(selectedTableData.rows[0]).map(
                            (column) => {
                              const isHidden =
                                hiddenColumns[selectedTableData.tableName]?.has(
                                  column
                                );
                              return (
                                <Resizable
                                  key={column}
                                  width={
                                    isHidden
                                      ? 10 // Small width for hidden column handle
                                      : columnWidths[
                                          selectedTableData.tableName
                                        ]?.[column] ?? 150
                                  }
                                  height={0}
                                  onResize={handleResize(
                                    selectedTableData.tableName,
                                    column
                                  )}
                                  resizeHandles={["e"]}
                                  minConstraints={[0, 0]}
                                  maxConstraints={[500, 0]}
                                >
                                  <th
                                    className={`border p-2 text-left cursor-pointer hover:bg-gray-200 ${
                                      isHidden ? "bg-gray-300" : ""
                                    }`}
                                    style={{
                                      width: isHidden
                                        ? 10
                                        : columnWidths[
                                            selectedTableData.tableName
                                          ]?.[column] ?? 150,
                                      minWidth: isHidden ? 10 : 50,
                                    }}
                                    onClick={() =>
                                      !isHidden && handleSort(column)
                                    }
                                  >
                                    {isHidden ? (
                                      <span
                                        className="block h-full w-full"
                                        title={`Show ${column}`}
                                      >
                                        ⋮
                                      </span>
                                    ) : (
                                      <>
                                        {column}
                                        {sortConfig.column === column && (
                                          <span className="ml-1">
                                            {sortConfig.direction === "asc"
                                              ? "↑"
                                              : "↓"}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </th>
                                </Resizable>
                              );
                            }
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRows?.map((row, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={`border ${
                              rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } hover:bg-gray-100`}
                          >
                            {Object.keys(row).map((column) => {
                              const isHidden =
                                hiddenColumns[selectedTableData.tableName]?.has(
                                  column
                                );
                              return (
                                <td
                                  key={column}
                                  className="border p-2 truncate"
                                  style={{
                                    width: isHidden
                                      ? 10
                                      : columnWidths[
                                          selectedTableData.tableName
                                        ]?.[column] ?? 150,
                                    maxWidth: isHidden
                                      ? 10
                                      : columnWidths[
                                          selectedTableData.tableName
                                        ]?.[column] ?? 150,
                                  }}
                                  title={!isHidden ? String(row[column]) : ""}
                                >
                                  {isHidden ? "" : row[column]}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
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
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Close
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDataModal;
