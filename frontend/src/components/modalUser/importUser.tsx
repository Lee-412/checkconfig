import { useState, ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "react-toastify";

interface ImportUserProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (fileContent: File) => void;
}

interface UserPreview {
  username: string;
  password: string;
}

const ImportUser = ({ isOpen, onClose, onImport }: ImportUserProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<UserPreview[]>([]);
  const [error, setError] = useState<string>("");
  const fileReader = new FileReader();

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
    const rows = text.trim().split("\n");
    if (rows.length < 1) {
      setError("CSV file is empty");
      setPreviewData([]);
      return;
    }

    // const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());
    // if (
    //   headers.length !== 2 ||
    //   headers[0] !== "username" ||
    //   headers[1] !== "password"
    // ) {
    //   setError("CSV must have exactly two columns: 'username' and 'password'");
    //   setPreviewData([]);
    //   return;
    // }

    const parsedUsers: UserPreview[] = rows.slice(1).map((row) => {
      const [username, password] = row.split(",").map((v) => v.trim());
      return {
        username: username || "",
        password: password || "",
      };
    });

    // Additional validation
    const invalidRows = parsedUsers.filter(
      (user) => !user.username || !user.password
    );
    if (invalidRows.length > 0) {
      setError("All rows must have both username and password");
      setPreviewData([]);
      return;
    }

    setPreviewData(parsedUsers);
  };

  // thua me r
    // const handleImport = () => {
    //   if (previewData.length > 0) {
    //     // Convert back to CSV string for the backend
    //     const csvContent =
    //       "username,password\n" +
    //       previewData
    //         .map((user) => `${user.username},${user.password}`)
    //         .join("\n");
    //     onImport(file);
    //     setPreviewData([]);
    //     setFile(null);
    //   }
    // };
    const handleImport = () => {
      if (file) {
        // Gọi hàm onImport và truyền trực tiếp tệp
        onImport(file);
    
        // Reset lại state sau khi import
        setPreviewData([]);  // Xóa preview data (nếu cần)
        setFile(null);        // Xóa file đã chọn
        toast.success("Your data is being imported");
        onClose();
      } 
    };
    
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with 'username' and 'password' columns
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
            Expected format: username,password
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

        {previewData.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">
              Preview ({previewData.length} users):
            </h4>
            <div className="max-h-40 overflow-auto border rounded">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Username</th>
                    <th className="border p-2 text-left">Password</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((user, index) => (
                    <tr key={index}>
                      <td className="border p-2">{user.username}</td>
                      <td className="border p-2">{user.password}</td>
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
