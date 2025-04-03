import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const EventVolumeChart = () => {
  const [data, setData] = useState([
    { name: "Jan", value: 20 },
    { name: "Feb", value: 30 },
    { name: "Mar", value: 40 },
    { name: "Apr", value: 50 },
    { name: "May", value: 60 },
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
          value: entry.value + generateRandomIncrease(5, 10), // Incremental increase
        }))
      );
    }, 3000); // 3000ms = 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array to run once on mount

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export { EventVolumeChart };
