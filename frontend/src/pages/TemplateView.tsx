// TemplateView.tsx
import { useState } from "react";
import { Button } from "../components/ui/button";
import { useGetNginx, useGetAuthstreamjs } from "../hooks/useForwardQueries";
import { useGetApplications } from "../hooks/useApplicationQueries"; // Assuming this hook exists
import { Clipboard, Download } from "lucide-react";
import { toast } from "react-toastify";

const TemplateView = () => {
  const [selectedApplicationId, setSelectedApplicationId] = useState("");

  const { data: applications, isLoading: applicationsLoading } =
    useGetApplications();

  const { data: templateNginx, isLoading: nginxLoading } = useGetNginx(
    selectedApplicationId
  );
  const { data: templateAuthstreamjs, isLoading: authstreamLoading } =
    useGetAuthstreamjs(selectedApplicationId);

  const handleApplicationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedApplicationId(e.target.value);
  };

  const handleCopyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success("Template copied to clipboard!");
    }
  };

  const handleDownload = (text: string, filename: string) => {
    if (text) {
      const blob = new Blob([text], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(`Template downloaded as ${filename}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-6">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Templates
          </h1>
        </div>

        {/* Application Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Please choose Application
          </label>
          {applicationsLoading ? (
            <p className="text-gray-500 dark:text-gray-400">
              Loading applications...
            </p>
          ) : (
            <select
              value={selectedApplicationId}
              onChange={handleApplicationSelect}
              className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="">Application</option>
              {applications?.map((app: any) => (
                <option key={app.id} value={app.id}>
                  {app.name} ({app.id})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Templates Display */}
        {selectedApplicationId && (
          <div className="space-y-8">
            <div className="grid gap-8">
              {/* Nginx Template */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Nginx.conf
                  </h3>
                </div>
                <pre className="bg-white dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto border border-gray-200 dark:border-gray-600 relative max-h-[500px]">
                  <code className="text-gray-900 dark:text-gray-100">
                    {nginxLoading
                      ? "Loading..."
                      : templateNginx || "No template available"}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyToClipboard(templateNginx)}
                        className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        disabled={nginxLoading || !templateNginx}
                      >
                        <Clipboard className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownload(templateNginx, "nginx.conf")
                        }
                        className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        disabled={nginxLoading || !templateNginx}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </code>
                </pre>
              </div>

              {/* Authstream Template */}
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Authstream.js
                  </h3>
                </div>
                <pre className="bg-white dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto border border-gray-200 dark:border-gray-600 relative">
                  <code className="text-gray-900 dark:text-gray-100">
                    {authstreamLoading
                      ? "Loading..."
                      : templateAuthstreamjs || "No template available"}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleCopyToClipboard(templateAuthstreamjs)
                        }
                        className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        disabled={authstreamLoading || !templateAuthstreamjs}
                      >
                        <Clipboard className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleDownload(templateAuthstreamjs, "authstream.js")
                        }
                        className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                        disabled={authstreamLoading || !templateAuthstreamjs}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateView;
