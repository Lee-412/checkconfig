import { useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const Sidebar = () => {
  const { isOpenSidebar } = useSidebar();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
    application: false,
    event: false,
    directory: false,
  });

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };
  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div
      className={`h-full bg-gray-100 dark:bg-background dark:text-white border transition-all duration-200 ${
        isOpenSidebar ? "w-64 p-4" : "w-0 p-0 overflow-hidden hidden"
      }`}
    >
      {isOpenSidebar && (
        <>
          <h2 className="text-xl dark:text-white font-bold mb-4 border-b-2 pb-2">
            Menu
          </h2>
          <nav className="space-y-2">
            <Link
              to="/"
              className={`block px-4 py-2 dark:text-white rounded border-b-2 border-gray-200 ${
                isActive("/") ? "font-bold text-blue-500" : "text-black"
              }`}
            >
              Dashboard
            </Link>

            {/* Application Dropdown */}
            <div
              className={`px-4 py-2 cursor-pointer rounded flex items-center justify-between border-b-2 border-gray-200 ${
                isActive("/application") ||
                isActive("/provider") ||
                isActive("/template")
                  ? "font-bold text-blue-500"
                  : "text-black"
              }`}
              onClick={() => toggleMenu("application")}
            >
              <span>Application</span>
              {openMenus.application ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {openMenus.application && (
              <div className="ml-4 space-y-1">
                <Link
                  to="/application"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/application")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Application
                </Link>
                <Link
                  to="/provider"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/provider")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Provider
                </Link>
                <Link
                  to="/template"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/template")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Template
                </Link>
              </div>
            )}

            {/* Event Dropdown */}
            <div
              className={`px-4 py-2 cursor-pointer rounded flex items-center justify-between border-b-2 border-gray-200 ${
                isActive("/message") ||
                isActive("/log") ||
                isActive("/notification")
                  ? "font-bold text-blue-500"
                  : "text-black"
              }`}
              onClick={() => toggleMenu("event")}
            >
              <span>Event</span>
              {openMenus.event ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {openMenus.event && (
              <div className="ml-4 space-y-1">
                <Link
                  to="/message"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/message")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Message
                </Link>
                <Link
                  to="/log"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/log") ? "font-bold text-blue-500" : "text-black"
                  }`}
                >
                  Log
                </Link>
                {/* <Link
                  to="/notification"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/notification")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Notification
                </Link> */}
              </div>
            )}

            {/* Directory Dropdown */}
            <div
              className={`px-4 py-2 cursor-pointer rounded flex items-center justify-between border-b-2 border-gray-200 ${
                isActive("/token") ||
                isActive("/user") ||
                isActive("/role") ||
                isActive("/group") ||
                isActive("/permission") ||
                isActive("/route")
                  ? "font-bold text-blue-500"
                  : "text-black"
              }`}
              onClick={() => toggleMenu("directory")}
            >
              <span>Directory</span>
              {openMenus.directory ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>
            {openMenus.directory && (
              <div className="ml-4 space-y-1">
                <Link
                  to="/token"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/token")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Token
                </Link>
                <Link
                  to="/user"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/user") ? "font-bold text-blue-500" : "text-black"
                  }`}
                >
                  User
                </Link>
                <Link
                  to="/role"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/role") ? "font-bold text-blue-500" : "text-black"
                  }`}
                >
                  Role
                </Link>
                <Link
                  to="/group"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/group")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Group
                </Link>
                <Link
                  to="/permission"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/permission")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Permission
                </Link>
                <Link
                  to="/route"
                  className={`block px-4 py-2 rounded border-b-2 border-gray-200 ${
                    isActive("/route")
                      ? "font-bold text-blue-500"
                      : "text-black"
                  }`}
                >
                  Route
                </Link>
              </div>
            )}
            <Link
              to="/database-config"
              className={`px-4 py-2 cursor-pointer rounded flex items-center justify-between border-b-2 border-gray-200 ${
                isActive("/database-config")
                  ? "font-bold text-blue-500"
                  : "text-black"
              }`}
            >
              My Database
            </Link>
            <Link
              to="/my-user"
              className={`px-4 py-2 cursor-pointer rounded flex items-center justify-between border-b-2 border-gray-200  ${
                isActive("/my-user") ? "font-bold text-blue-500" : "text-black"
              }`}
            >
              My User
            </Link>
            <Link
              to="/about"
              className={`px-4 py-2 cursor-pointer rounded flex items-center justify-between border-b-2 border-gray-200  ${
                isActive("/about") ? "font-bold text-blue-500" : "text-black"
              }`}
            >
              About
            </Link>
            <Link
              to="/documentations"
              className={`px-4 py-2 cursor-pointer rounded flex items-center justify-between border-b-2 border-gray-200  ${
                isActive("/documentations")
                  ? "font-bold text-blue-500"
                  : "text-black"
              }`}
            >
              Documentations
            </Link>
          </nav>
        </>
      )}
    </div>
  );
};

export default Sidebar;
