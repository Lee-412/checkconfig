import { Outlet } from "react-router-dom";
import Header from "../components/headerPublic";
import { ToastContainer } from "react-toastify";

export default function PublicLayout() {
  return (
    <div className={"min-h-screen"}>
      <div className="flex flex-col flex-1 w-full">
        <Header />

        <div className="flex-1 w-full overflow-hidden">
          <Outlet />
        </div>
        <ToastContainer />
      </div>{" "}
    </div>
  );
}
