import { Button } from "../../components/ui/button";
import { Clipboard, Download, ChevronLeft } from "lucide-react";
import { toast } from "react-toastify";

const TemplateDisplay = ({
  templates,
  handleNext,
  handleBack,
  step,
  stepsLength,
  isPending,
}) => {
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Template copied to clipboard!");
  };

  const handleDownload = (text, filename) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success(`Template downloaded as ${filename}`);
  };

  return (
    <div className="space-y-12">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Generated Templates
      </h2>
      <div className="grid gap-8">
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Proxy Configuration
            </h3>
          </div>
          <pre className="bg-white dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto border border-gray-200 dark:border-gray-600 relative">
            <code className="text-gray-900 dark:text-gray-100">
              {templates.template1}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyToClipboard(templates.template1)}
                  className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownload(templates.template1, "proxy-config.js")
                  }
                  className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </code>
          </pre>
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Authentication Handler
            </h3>
          </div>
          <pre className="bg-white dark:bg-gray-800 p-4 rounded-md text-sm overflow-auto border border-gray-200 dark:border-gray-600 relative">
            <code className="text-gray-900 dark:text-gray-100">
              {templates.template2}
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyToClipboard(templates.template2)}
                  className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                >
                  <Clipboard className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownload(templates.template2, "auth-handler.js")
                  }
                  className="flex items-center text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all p-1"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </code>
          </pre>
        </div>
      </div>
      <div className="flex justify-between mt-10 gap-4">
        <Button
          onClick={handleBack}
          variant="outline"
          disabled={isPending}
          className="w-full md:w-auto flex items-center justify-center bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg px-6 py-2 transition-all"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={isPending}
          className="w-full md:w-auto flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-6 py-2 transition-all"
        >
          {isPending ? "Processing..." : "Finish"}
        </Button>
      </div>
    </div>
  );
};

export default TemplateDisplay;
