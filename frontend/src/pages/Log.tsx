import { MessageCircle } from "lucide-react";
import TableLog from "../components/tableLog.tsx";
import { ToggleButton } from "../context/SidebarContext";
import { useGetLogs } from "../hooks/useLogQueries.tsx";
import { EventVolumeChart } from "../components/eventVolumeChart.tsx";
import { EventTypeChart } from "../components/eventTypeChart.tsx";

interface Log {
  id: string;
  name: string;
  type: string;
  body: string;
  created: string;
}

const Log = () => {
  const { data: logs, isLoading, error } = useGetLogs();

  return (
    <div className="h-full w-full flex items-center justify-center dark:bg-gray-950 p-6">
      <div className="w-full h-full bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-x-4">
            <ToggleButton />

            <div className="flex flex-col max-w-lg">
              <h2 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
                <MessageCircle className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
                Log
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Provide support for protocols like SAML and OAuth to assigned
                logs.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Event Volume
            </h3>
            <EventVolumeChart />
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              Event Type
            </h3>
            <EventTypeChart />
          </div>
        </div>
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">
            Loading tokens...
          </p>
        ) : error ? (
          <p className="text-center text-red-500">
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </p>
        ) : logs ? (
          <TableLog logs={logs.contents} />
        ) : (
          <p>No tokens available</p>
        )}
      </div>
    </div>
  );
};

export default Log;
