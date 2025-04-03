const Sidebar = ({ steps, currentStep }) => (
  <div className="w-full md:w-1/4 bg-gray-50 dark:bg-gray-700 p-6 border-r dark:border-gray-600">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
      Progress
    </h3>
    <div className="space-y-3">
      {steps.map((label, index) => (
        <div
          key={index}
          className={`flex items-center p-3 rounded-lg transition-all duration-300 cursor-pointer ${
            index === currentStep
              ? "bg-blue-600 text-white shadow-lg"
              : "text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          <span
            className={`w-8 h-8 flex items-center justify-center rounded-full mr-3 font-semibold ${
              index === currentStep
                ? "bg-white text-blue-600"
                : "bg-gray-200 dark:bg-gray-500 text-gray-700 dark:text-gray-200"
            }`}
          >
            {index + 1}
          </span>
          {label}
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
