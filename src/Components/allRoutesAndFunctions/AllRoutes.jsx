import { Route, Routes } from "react-router-dom";
import Login from "../ui/Login";
import Dashboard from "../ui/Dashboard";
import {
  ProtectedRoutes,
  UnProtectedRoutes,
  SlashRedirect,
} from "./AllFunctions";
import Booking from "../ui/Booking";
import AppLayout from "../../Layout/AppLayout";
import Users from "../ui/Users";
import ChargingStations from "../ui/ChargingStations";
import StationReviews from "../ui/StationReviews";
import ChargerManagement from "../ui/ChargerManagement";
import UserDetails from "../detailComponents/UserDetails";
import StationDetails from "../detailComponents/StationDetails";

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
          <Route path="/user-details/:id" element={<UserDetails />}></Route>

          <Route
            path="/charging-stations"
            element={<ChargingStations />}
          ></Route>
          <Route
            path="/charging-station-details/:id"
            element={<StationDetails />}
          ></Route>
          <Route path="stations-review" element={<StationReviews />}></Route>
          <Route
            path="charger-management"
            element={<ChargerManagement />}
          ></Route>
        </Route>
      </Routes>
    </>
  );
};

export default AllRoutes;
