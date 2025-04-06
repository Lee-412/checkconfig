import { useState, ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useGetConfig, useGetTableConfig } from "../../hooks/useSigninQueries"; // Adjust path as needed
import { TableConfig, tableSchema, DbConfig } from "../../api/type"; // Adjust path as needed

interface ImportUserProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (fileContent: File) => void;
}

interface UserPreview {
  [key: string]: string;
}

const ImportUser = ({ isOpen, onClose, onImport }: ImportUserProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<UserPreview[]>([]);
  const [error, setError] = useState<string>("");
  const fileReader = new FileReader();

  const { data: tableConfigs, isLoading: tableLoading } = useGetTableConfig();
  const { data: dbConfigs, isLoading: dbLoading } = useGetConfig();

  const tableConfig = tableConfigs?.[0];
  const dbConfig = dbConfigs?.[0];

  // Find the table schema that matches tableUser
  const userTableSchema = dbConfig?.tableIncludeList.find(
    (table) => table.tableName === tableConfig?.userTable
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      setFile(e.dataTransfer.files[0]);
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    fileReader.onload = (event) => {
      const text = event.target?.result as string;
      validateAndParseCSV(text);
    };
    fileReader.readAsText(file);
  };

  const validateAndParseCSV = (text: string) => {
    setError("");
    if (!userTableSchema) {
      setError("User table configuration not found");
      return;
    }

    const rows = text.trim().split("\n");
    if (rows.length < 1) {
      setError("CSV file is empty");
      setPreviewData([]);
      return;
    }

    const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());
    const expectedHeaders = userTableSchema.columns.map((col) =>
      col.name.toLowerCase()
    );

    if (
      headers.length !== expectedHeaders.length ||
      !headers.every((header, index) => header === expectedHeaders[index])
    ) {
      setError(`CSV must have columns: ${expectedHeaders.join(", ")}`);
      setPreviewData([]);
      return;
    }

    const parsedUsers: UserPreview[] = rows.slice(1).map((row) => {
      const values = row.split(",").map((v) => v.trim());
      const user: UserPreview = {};
      userTableSchema.columns.forEach((column, index) => {
        user[column.name] = values[index] || "";
      });
      return user;
    });

    const invalidRows = parsedUsers.filter((user) =>
      userTableSchema.columns.some((column) => !user[column.name])
    );
    if (invalidRows.length > 0) {
      setError("All rows must have values for all columns");
      setPreviewData([]);
      return;
    }

    setPreviewData(parsedUsers);
  };

  const handleImport = () => {
    // if (previewData.length > 0 && userTableSchema) {
    //   const headers = userTableSchema.columns.map((col) => col.name).join(",");
    //   const csvContent =
    //     headers +
    //     "\n" +
    //     previewData
    //       .map((user) =>
    //         userTableSchema.columns.map((col) => user[col.name]).join(",")
    //       )
    //       .join("\n");
    //   onImport();
    //   setPreviewData([]);
    //   setFile(null);
    // }
  
    if (file) {
      // Gọi hàm onImport và truyền trực tiếp tệp
      onImport(file);
  
      // Reset lại state sau khi import
      setPreviewData([]);  // Xóa preview data (nếu cần)
      setFile(null);        // Xóa file đã chọn
    } 
  };

  if (tableLoading || dbLoading) {
    return <div>Loading configuration...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file for table '{tableConfig?.userTable}' with columns:
            {userTableSchema?.columns.map((col) => col.name).join(", ")}
          </DialogDescription>
        </DialogHeader>

        <div
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <p className="text-gray-600">
            Drag and drop your CSV file here, or click to select one
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Expected format:{" "}
            {userTableSchema?.columns.map((col) => col.name).join(", ")}
          </p>
        </div>

        <input
          id="fileInput"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {previewData.length > 0 && userTableSchema && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">
              Preview ({previewData.length} users):
            </h4>
            <div className="max-h-40 overflow-auto border rounded">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {userTableSchema.columns.map((column) => (
                      <th key={column.name} className="border p-2 text-left">
                        {column.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((user, index) => (
                    <tr key={index}>
                      {userTableSchema.columns.map((column) => (
                        <td key={column.name} className="border p-2">
                          {user[column.name]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={handleImport} className="mt-4 w-full">
              Import {previewData.length} Users
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportUser;
