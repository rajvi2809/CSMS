import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export const isUserAuthenticated = () => {
  const [cookies] = useCookies(["accessToken"]);
  return !!cookies.accessToken;
};

export const ProtectedRoutes = () => {
  const [cookies] = useCookies(["accessToken"]);
  const isAuthenticated = !!cookies.accessToken;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const UnProtectedRoutes = () => {
  const [cookies] = useCookies(["accessToken"]);
  const isAuthenticated = !!cookies.accessToken;

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export const SlashRedirect = () => {
  const location = useLocation();
  if (location.pathname === "/") {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
