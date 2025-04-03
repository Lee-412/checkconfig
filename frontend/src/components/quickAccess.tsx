import { Link } from "react-router-dom";

const QuickAccess = () => {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col">
      <h2 className="text-lg font-bold mb-4 text-black dark:text-white">
        Quick Actions
      </h2>
      <ul className="space-y-2 flex-grow">
        <li>
          <Link
            to="/forward"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Create new Forward Flow
          </Link>
        </li>
        <li>
          <Link
            to="/database-config"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            My Database
          </Link>
        </li>
        <li>
          <Link
            to="/forward"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Create new Forward Flow
          </Link>
        </li>
        <li>
          <Link
            to="/application"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Create new Application
          </Link>
        </li>
        <li>
          <Link
            to="/logs"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Check the logs
          </Link>
        </li>
        <li>
          <Link
            to="/user"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Manage User
          </Link>
        </li>
        <li>
          <Link
            to="/notification"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Create new Notification
          </Link>
        </li>
        <li>
          <Link
            to="/message"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Create new Message
          </Link>
        </li>
        <li>
          <Link
            to="/release"
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Check the release
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default QuickAccess;
