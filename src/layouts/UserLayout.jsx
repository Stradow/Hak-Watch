import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function UserLayout() {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
}

export default UserLayout;
