import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Header from "./header";

export default function AppLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <Outlet />
    </>
  );
}
