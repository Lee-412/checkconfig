import { FC } from "react";

interface StatsCardProps {
  title: string;
  count: number;
  color: string;
}

const StatsCard: FC<StatsCardProps> = ({ title, count, color }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 ${color} transition-transform duration-300 hover:scale-105 hover:shadow-lg`}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2 transition-all duration-500">
        {count}
      </p>
    </div>
  );
};

export default StatsCard;
