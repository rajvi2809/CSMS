import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import {
  ProtectedRoutes,
  UnProtectedRoutes,
  SlashRedirect,
} from "./AllFunctions";
import Booking from "./Booking";
import AppLayout from "../layout/AppLayout";
import Users from "./Users";
import ChargingStations from "./ChargingStations";
import StationReviews from "./StationReviews";
import ChargerManagement from "./ChargerManagement";
import UserDetails from "./UserDetails";
import StationDetails from "./StationDetails";

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
