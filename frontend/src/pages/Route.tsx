import { Shield } from "lucide-react";
import TableRoute from "../components/tableRoute";
import { ToggleButton } from "../context/SidebarContext";
import { useGetRoutes } from "../hooks/useRouteQueries";

const ProtectedRoute = () => {
  const { data: routes, isLoading, error } = useGetRoutes();

  return (
    <div className="h-full w-full flex items-center justify-center dark:bg-gray-950 p-6">
      <div className="w-full h-full bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-x-4">
            <ToggleButton />
            <div className="flex flex-col max-w-lg">
              <h2 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
                <Shield className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
                Route
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Routes are used throughout AuthStream for Email validation,
                Recovery keys, and API access.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading routes...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        ) : routes ? (
          <TableRoute routes={routes} />
        ) : (
          <p>No routes available</p>
        )}
      </div>
    </div>
  );
};

export default ProtectedRoute;
