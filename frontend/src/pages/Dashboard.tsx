import QuickAccess from "../components/quickAccess";
import StatsCard from "../components/statCards";
import { ToggleButton } from "../context/SidebarContext";
import { EventVolumeChart } from "../components/eventVolumeChart";
import { EventTypeChart } from "../components/eventTypeChart";
import { useState, useEffect } from "react";

const Dashboard = () => {
  // State for stats with initial values
  const [stats, setStats] = useState({
    provider: 3,
    message: 7,
    notification: 5,
  });

  // Effect to increase stats every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        provider: prevStats.provider + Math.floor(Math.random() * 3) + 1, // Increase by 1-3
        message: prevStats.message + Math.floor(Math.random() * 5) + 1, // Increase by 1-5
        notification:
          prevStats.notification + Math.floor(Math.random() * 2) + 1, // Increase by 1-2
      }));
    }, 3000); // Update every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center dark:bg-gray-950 p-6">
      <div className="w-full h-auto bg-gray-200 dark:bg-gray-900 p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between gap-x-4">
            <ToggleButton />
            <div className="flex flex-col max-w-lg">
              <h2 className="text-2xl font-bold flex items-center text-gray-800 dark:text-white">
                Welcome, AuthStream
              </h2>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-full">
          <div className="w-1/3 h-full">
            <QuickAccess />
          </div>

          <div className="w-2/3 flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              <StatsCard
                title="Provider"
                count={stats.provider}
                color="border-blue-500"
              />
              <StatsCard
                title="Message"
                count={stats.message}
                color="border-green-500"
              />
              <StatsCard
                title="Notification"
                count={stats.notification}
                color="border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
