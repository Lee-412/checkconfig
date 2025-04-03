import React from "react";

interface LoadingBarProps {
  isLoading: boolean;
  color?: string;
  height?: string;
}

const LoadingBar: React.FC<LoadingBarProps> = ({
  isLoading,
  color = "bg-blue-500",
  height = "h-1",
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={`fixed top-0 left-0 w-full ${height} overflow-hidden z-50 sm:rounded-lg`}
    >
      <div
        className={`absolute ${height} ${color} sm:rounded-lg`}
        style={{
          width: "100%",
          animation: "loadingLine 1.5s infinite ease-in-out",
        }}
      />
      <style>{`
        @keyframes loadingLine {
          0% {
            left: -100%;
          }
          50% {
            left: 0%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingBar;
