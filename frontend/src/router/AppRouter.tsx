// AppRouter.tsx
import { Navigate, useRoutes } from "react-router-dom";
import NotFound from "../pages/not-found/index";
import { FC, useState } from "react";
import PrivateLayout from "../layouts/PrivateLayout";
import PublicLayout from "../layouts/PublicLayout";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import { JWT_LOCAL_STORAGE_KEY } from "../constants/data";
import LoginConfirm from "../components/loginConfirm";

const SignedRoute: FC<{
  element: JSX.Element;
  path: string;
}> = ({ element, path }) => {
  const isAuthenticated = localStorage.getItem(JWT_LOCAL_STORAGE_KEY);
  const [isLoginConfirmOpen, setIsLoginConfirmOpen] = useState(false);

  // Allow dashboard without authentication
  if (path === "/" || path === "/home") {
    return element;
  }

  // If not authenticated, show login confirmation instead of direct redirect
  if (!isAuthenticated) {
    return (
      <>
        {element} {/* Render the page in the background */}
        <LoginConfirm
          isOpen={!isAuthenticated && !isLoginConfirmOpen}
          onClose={() => setIsLoginConfirmOpen(false)}
        />
      </>
    );
  }

  return element;
};

const routes = [
  {
    element: <PrivateLayout />,
    children: [
      ...Object.values(PrivateRoute).map(({ path, component: Component }) => ({
        path,
        element: <SignedRoute element={<Component />} path={path} />,
      })),
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      ...Object.values(PublicRoute).map(({ path, component: Component }) => ({
        path,
        element: <Component />,
      })),
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const AppRouter: FC = () => {
  return useRoutes(routes);
};

export default AppRouter;
