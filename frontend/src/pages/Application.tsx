import { AppWindow } from "lucide-react";
import TableApplication from "../components/tableApplication.tsx";
import { ToggleButton } from "../context/SidebarContext";
import { useGetApplications } from "../hooks/useApplicationQueries.tsx";
import LoadingBar from "../components/LoadingBar.tsx";

const Application = () => {
  const { data: applications, isLoading, error } = useGetApplications();

  return (
    <div className="h-full w-full flex items-center justify-center dark:bg-gray-950 p-6">
      <LoadingBar isLoading={isLoading} />

      <div className="w-full h-full bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-x-4">
            <ToggleButton />

            <div className="flex flex-col max-w-lg">
              <h2 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
                <AppWindow className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
                Application
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Provide support for protocols like SAML and OAuth to assigned
                applications.
              </p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading applications...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        ) : applications && Array.isArray(applications) ? (
          <TableApplication applications={applications} />
        ) : (
          <p>No tokens available</p>
        )}
      </div>
    </div>
  );
};

export default Application;
