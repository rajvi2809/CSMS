import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../Slices/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { isAction } from "redux";

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

  const users = useSelector((state) => state.users.users);

  return (
    <>
      <aside className={`sidebar ${sideBar ? "open-menu" : ""}`}>
        <div className="logo-div sticky">
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

            <NavLink to="/charger-management">
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
            </NavLink>

            <li className="line-wrapper" onClick={toggleList}>
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
                <li className="inner-list">Brands</li>
                <li className="inner-list">Vehicles</li>
                <li className="inner-list">Connectors</li>
                <li className="inner-list">Amenities</li>
                <li className="inner-list">Contents</li>
                <li className="inner-list">Fees</li>
                <li className="inner-list">Manage Role</li>
                <li className="inner-list">Manage Users</li>
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
