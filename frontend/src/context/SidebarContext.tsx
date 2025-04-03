import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext<
  { isOpenSidebar: boolean; toggleSidebar: () => void } | undefined
>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpenSidebar, setOpenSidebar] = useState(true);

  const toggleSidebar = () => {
    setOpenSidebar(!isOpenSidebar);
  };

  return (
    <SidebarContext.Provider value={{ isOpenSidebar, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

import { Menu } from "lucide-react";

export const ToggleButton: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 transition  bg-white dark:bg-gray-800"
    >
      <Menu className="w-6 h-6 text-gray-800 dark:text-gray-400" />
    </button>
  );
};
