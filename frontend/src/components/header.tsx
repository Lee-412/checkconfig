import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import ThemeSwitcher from "./themeMode";
import { Button } from "./ui/button";
import { JWT_LOCAL_STORAGE_KEY } from "../constants/data";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const navigate = useNavigate();

  const handleClickAvatar = () => {
    console.log("click avatar");
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
      navigate("/signin");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="container flex items-center space-x-4">
        <div className="text-xl font-bold text-[#2563eb]">AuthStream</div>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute w-5 h-5 text-gray-400 left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4 ">
          <ThemeSwitcher />
        </div>
        <button
          onClick={() => setNotificationOpen(!isNotificationOpen)}
          className="relative p-2 text-gray-600 rounded-lg hover:bg-gray-100 bg-white dark:bg-gray-800"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
          {isNotificationOpen && (
            <div className="absolute right-0 w-48 mt-2 overflow-hidden bg-white rounded-md shadow-lg top-full">
              <div className="p-4 text-sm text-gray-600">
                Notification Content
              </div>
              <div className="p-4 text-sm text-gray-600">
                Notification Content
              </div>
            </div>
          )}
        </button>
        {/* <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10"></div> */}
        <Button onClick={handleLogout}>Logout</Button>
        <Avatar onClick={handleClickAvatar}>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
