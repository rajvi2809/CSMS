import { Route, Routes } from "react-router-dom";
import Login from "../Components/Login";
import Dashboard from "../Components/Dashboard";
import {
  ProtectedRoutes,
  UnProtectedRoutes,
  SlashRedirect,
} from "./AllFunctions";
import Booking from "../Components/Booking";
import AppLayout from "../Layout/AppLayout";
import Users from "../Components/Users";
import ChargingStations from "../Components/ChargingStations";
import StationReviews from "../Components/StationReviews";
import UserDetails from "../Components/UserDetails";
import StationDetails from "../Components/StationDetails";
import BrandsManagement from "../Components/BrandsManagement";
import AmenityManagement from "../Components/AmenityManagement";
import ConnectorManagement from "../Components/ConnectorManagement";
import VehicleManagement from "../Components/VehicleManagement";
import FeesManagement from "../Components/FeesManagement";
import ContentManagement from "../Components/ContentManagement";
import ManageRoles from "../Components/ManageRoles";
import ManageUsers from "../Components/ManageUsers";

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
          <Route path="/stations-review" element={<StationReviews />}></Route>

          {/* <Route
            path="charger-management"
            element={<ChargerManagement />}
          ></Route> */}

          <Route
            path="/brands-management"
            element={<BrandsManagement />}
          ></Route>

          <Route
            path="/vehicle-management"
            element={<VehicleManagement />}
          ></Route>

          <Route
            path="/amenities-management"
            element={<AmenityManagement />}
          ></Route>

          <Route
            path="/connectors-management"
            element={<ConnectorManagement />}
          ></Route>

          <Route
            path="/content-management"
            element={<ContentManagement />}
          ></Route>

          <Route path="/fee-management" element={<FeesManagement />}></Route>
          <Route path="/admin-role" element={<ManageRoles />}></Route>
          <Route path="/manage-permissions" element={<ManageUsers />}></Route>
        </Route>
      </Routes>
    </>
  );
};

export default AllRoutes;
