import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../Slices/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "../static/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setOpen] = useState(false);
  const [, , removeCookie] = useCookies(["accessToken"]);

  const toggleList = () => {
    setOpen(!isOpen);
  };

  const [sideBar, setSideBar] = useState(false);
  const toggleSideBar = () => {
    setSideBar(!sideBar);
    // console.log(!sideBar);
  };

  const handleLogout = () => {
    dispatch(removeUser());
    removeCookie("accessToken");
    navigate("/login");
  };
  const handleNavigate = () => {
    navigate("/dashboard");
  };

  const users = useSelector((state) => state.users.users);

  return (
    <>
      <aside className={`sidebar ${sideBar ? "open-menu" : ""}`}>
        <div className="logo-div sticky" onClick={handleNavigate}>
          <img className="logo-img" src="/logomain.svg" alt="" />
          {/* <sub className="sub-class">SUPER ADMIN</sub><small>v 1.0</small> */}
        </div>
        <div className="list">
          <ul className="main-class">
            <NavLink to="/dashboard">
              {({ isActive }) => (
                <li className={`line-wrapper ${isActive ? "active" : ""}`}>
                  <img
                    style={{
                      backgroundColor: "#adb5bd",
                      WebkitMask: "url(/home.svg) no-repeat center",
                      mask: "url(/home.svg) no-repeat center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                  <p> DashBoard</p>
                </li>
              )}
            </NavLink>

            <NavLink to="/booking">
              {({ isActive }) => (
                <li className={`line-wrapper ${isActive ? "active" : ""}`}>
                  <img
                    style={{
                      backgroundColor: "#adb5bd",
                      WebkitMask: "url(/book.svg) no-repeat center",
                      mask: "url(/book.svg) no-repeat center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />{" "}
                  <p>Booking Management</p>
                </li>
              )}
            </NavLink>

            <NavLink to="/users">
              {({ isActive }) => (
                <li className={`line-wrapper ${isActive ? "active" : ""}`}>
                  <img
                    style={{
                      backgroundColor: "#adb5bd",
                      WebkitMask: "url(/user.svg) no-repeat center",
                      mask: "url(/user.svg) no-repeat center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                  <p>Users </p>
                </li>
              )}
            </NavLink>

            <NavLink to="/charging-stations">
              {({ isActive }) => (
                <li className={`line-wrapper ${isActive ? "active" : ""}`}>
                  <img
                    style={{
                      backgroundColor: "#adb5bd",
                      WebkitMask: "url(/charge.svg) no-repeat center",
                      mask: "url(/charge.svg) no-repeat center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                  <p>Charging stations </p>
                </li>
              )}
            </NavLink>

            <NavLink to="/stations-review">
              {({ isActive }) => (
                <li className={`line-wrapper ${isActive ? "active" : ""}`}>
                  <img
                    style={{
                      backgroundColor: "#adb5bd",
                      WebkitMask: "url(/star.svg) no-repeat center",
                      mask: "url(/star.svg) no-repeat center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                    alt="Home Icon"
                  />
                  <p>Station Review </p>
                </li>
              )}
            </NavLink>

            {/* <NavLink to="/charger-management">
              {({ isActive }) => (
                <li className={`line-wrapper ${isActive ? "active" : ""}`}>
                  <img
                    style={{
                      backgroundColor: "#adb5bd",
                      WebkitMask: "url(/charger.svg) no-repeat center",
                      mask: "url(/charger.svg) no-repeat center",
                      WebkitMaskSize: "contain",
                      maskSize: "contain",
                    }}
                  />
                  <p>Chargers </p>
                </li>
              )}
            </NavLink> */}

            <li
              className={`line-wrapper ${isOpen && "active"}`}
              onClick={toggleList}
              style={{ alignItems: "center" }}
            >
              <img
                style={{
                  backgroundColor: "#adb5bd",
                  WebkitMask: "url(/settings.svg) no-repeat center",
                  mask: "url(/settings.svg) no-repeat center",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                }}
              />
              <p>Settings</p>
              <img
                src="/sidearrow.svg"
                className={`${isOpen ? "rotated" : "arrow-icon"}`}
                style={{ height: "30px", width: "15px", marginLeft: "auto" }}
              />
            </li>

            {isOpen && (
              <ul>
                <NavLink to="/brands-management">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Brands
                    </li>
                  )}
                </NavLink>
                <NavLink to="/vehicle-management">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Vehicles
                    </li>
                  )}
                </NavLink>
                <NavLink to="/connectors-management">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Connectors
                    </li>
                  )}
                </NavLink>
                <NavLink to="/amenities-management">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Amenities
                    </li>
                  )}
                </NavLink>
                <NavLink to="/content-management">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Contents
                    </li>
                  )}
                </NavLink>
                <NavLink to="/fee-management">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Fees
                    </li>
                  )}
                </NavLink>

                <NavLink to="/admin-role">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Manage Role
                    </li>
                  )}
                </NavLink>

                <NavLink to="/manage-permissions">
                  {({ isActive }) => (
                    <li className={`inner-list ${isActive ? "active" : ""}`}>
                      Manage Users
                    </li>
                  )}
                </NavLink>
              </ul>
            )}
          </ul>
        </div>
        <div className="sticky footer-bg">
          <div className="btn-cls">
            <button className="btn-settings">
              <div className="text-single">
                {users?.firstname?.[0]}
                {users?.lastname?.[0]}
              </div>
              <div className="text-group">
                <h6>
                  {users?.firstname} {users?.lastname}
                </h6>
                <p> {users?.email}</p>
              </div>
            </button>
            <div className="display-hover">
              <div className="set-div1">Change Password</div>
              <div className="set-div2" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
