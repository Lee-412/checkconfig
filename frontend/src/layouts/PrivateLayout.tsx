// layouts/PrivateLayout.tsx
import { Outlet } from "react-router-dom";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import Sidebar from "../components/Sidebar";
import HeaderPrivate from "../components/header"; // Rename to distinguish
import HeaderPublic from "../components/headerPublic";
import { ToastContainer } from "react-toastify";
import { JWT_LOCAL_STORAGE_KEY } from "../constants/data";

const Content = () => {
  const { isOpenSidebar } = useSidebar();

  return (
    <div
      className={`transition-all duration-300 flex-1 ${
        isOpenSidebar ? "ml-64" : "ml-0"
      }`}
    >
      <Outlet />
    </div>
  );
};

export default function PrivateLayout() {
  const isAuthenticated = !!localStorage.getItem(JWT_LOCAL_STORAGE_KEY);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <header className="fixed top-0 left-0 w-full z-20 bg-white shadow">
          {isAuthenticated ? <HeaderPrivate /> : <HeaderPublic />}
        </header>

        <div className="flex flex-1 mt-10">
          <aside
            className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-all duration-200 z-10 ${
              useSidebar().isOpenSidebar ? "w-64" : "w-0"
            } overflow-y-auto`}
          >
            <Sidebar />
          </aside>

          <div className="flex-1 w-full p-6">
            <Content />
          </div>
          <ToastContainer />
        </div>
      </div>
    </SidebarProvider>
  );
}
