import { useState, useEffect } from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const EventTypeChart = () => {
  const [data, setData] = useState([
    { name: "Error", value: 20, color: "#FF6384" },
    { name: "Warning", value: 35, color: "#FFCE56" },
    { name: "Info", value: 50, color: "#36A2EB" },
  ]);

  // Function to generate a small random increase
  const generateRandomIncrease = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    // Set up an interval to increase data every 3 seconds
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((entry) => ({
          ...entry,
          value: entry.value + generateRandomIncrease(5, 15), // Incremental increase
        }))
      );
    }, 3000); // 3000ms = 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run once on mount

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export { EventTypeChart };
