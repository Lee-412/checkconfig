import { useState, ChangeEvent, DragEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Route } from "../../api/type";
import { toast } from "react-toastify";

interface ImportCSVProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (routes: Route[]) => void;
}

const ImportCSV = ({ isOpen, onClose, onImport }: ImportCSVProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<Route[]>([]);
  const fileReader = new FileReader();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      processFile(droppedFile);
    }
  };

  const processFile = (file: File) => {
    fileReader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        parseCSV(text);
      } else {
        toast.error("Failed to read file contents");
      }
    };
    fileReader.onerror = () => {
      toast.error("Error reading file");
    };
    fileReader.readAsText(file);
  };

  const parseCSV = (text: string) => {
    const rows = text.trim().split("\n");
    if (rows.length < 2) {
      toast.error("CSV file is empty or invalid");
      return;
    }

    const headers = rows[0].split(",").map((h) => h.trim().toLowerCase());
    const requiredHeaders = ["id", "name", "route", "method"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      toast.error(
        `Invalid CSV format: Missing required columns: ${missingHeaders.join(
          ", "
        )}`
      );
      return;
    }

    const parsedRoutes: Route[] = rows
      .slice(1)
      .map((row, index) => {
        const values = row.split(",").map((v) => v.trim());
        const now = new Date().toISOString();

        return {
          id:
            values[headers.indexOf("id")] ||
            `ROUTE${Date.now()}${index}${Math.random()
              .toString(36)
              .substr(2, 5)}`,
          name: values[headers.indexOf("name")] || "",
          route: values[headers.indexOf("route")] || "",
          method: values[headers.indexOf("method")]?.toUpperCase() || "GET",
          checkProtected: headers.includes("checkprotected")
            ? values[headers.indexOf("checkprotected")].toLowerCase() === "true"
            : false,
          descripString: headers.includes("descripstring")
            ? values[headers.indexOf("descripstring")] || ""
            : "",
          createdAt: headers.includes("createdat")
            ? values[headers.indexOf("createdat")] || now
            : now,
          updatedAt: headers.includes("updatedat")
            ? values[headers.indexOf("updatedat")] || now
            : now,
        };
      })
      .filter((route) => route.name && route.route && route.method); // Filter out invalid rows

    if (parsedRoutes.length === 0) {
      toast.error("No valid routes found in CSV");
      return;
    }

    setPreviewData(parsedRoutes);
  };

  const handleImport = () => {
    if (previewData.length > 0) {
      onImport(previewData);
      setPreviewData([]);
      setFile(null);
      onClose();
    } else {
      toast.warn("No data to import");
    }
  };

  const handleCancel = () => {
    setPreviewData([]);
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Routes from CSV</DialogTitle>
          <DialogDescription>
            Drag & drop or click to upload a CSV file containing route data
          </DialogDescription>
        </DialogHeader>

        <div
          className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-gray-500 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <p className="text-gray-600">
            {file
              ? `Selected file: ${file.name}`
              : "Drag and drop your CSV file here, or click to select one"}
          </p>
        </div>

        <input
          id="fileInput"
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileChange}
        />

        {previewData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              Preview ({previewData.length} routes)
            </h3>
            <div className="max-h-[300px] overflow-auto border rounded-lg">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Route</th>
                    <th className="border p-2 text-left">Method</th>
                    <th className="border p-2 text-left">Protected</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border p-2">{item.name}</td>
                      <td className="border p-2">{item.route}</td>
                      <td className="border p-2">{item.method}</td>
                      <td className="border p-2">
                        {item.checkProtected ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Import
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportCSV;
