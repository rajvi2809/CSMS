import { Route, Routes } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import {
  ProtectedRoutes,
  UnProtectedRoutes,
  SlashRedirect,
} from "./AllFunctions";


const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route element={<SlashRedirect />}>
          <Route exact path="/" element={<Login />} />
        </Route>
      </Routes>

      <Routes>
        <Route element={<UnProtectedRoutes />}>
          <Route exact path="/login" element={<Login />} />
        </Route>
      </Routes>

      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default AllRoutes;
