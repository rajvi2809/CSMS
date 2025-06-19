import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import {
  ProtectedRoutes,
  UnProtectedRoutes,
  SlashRedirect,
} from "./AllFunctions";
import Booking from "./Booking";
import AppLayout from "./layout/AppLayout";
import Users from "./Users";

const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<SlashRedirect />}>
          <Route exact path="/" element={<Login />} />
        </Route>

        <Route element={<UnProtectedRoutes />}>
          <Route exact path="/login" element={<Login />} />
        </Route>

        <Route path="/" element={<AppLayout />}>
          <Route element={<ProtectedRoutes />}>
            <Route exact path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="/booking" element={<Booking />}></Route>
          <Route path="/users" element={<Users />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default AllRoutes;
