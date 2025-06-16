import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "./Slices/dataSlice";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function Dashboard() {
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
      <div className={`top-bar ${sideBar ? "header-menu" : ""}`}>
        <div
          className={`menu-toggle ${sideBar ? "close-btn" : ""}`}
          onClick={toggleSideBar}
        >
          <img src={sideBar ? "./close.svg" : "./toggle.svg"} alt="" />
        </div>
        <div className="top-logo">
          {users?.firstname?.[0]}
          {users?.lastname?.[0]}
        </div>
      </div>

      <aside className={`sidebar ${sideBar ? "open-menu" : ""}`}>
        <div className="logo-div sticky">
          <img
            className="logo-img"
            src="https://mniladmin.hashtechy.space/static/media/logo.dca4fb32be8888f2e0fe20c4d69b193f.svg"
            alt=""
          />
          {/* <sub className="sub-class">SUPER ADMIN</sub><small>v 1.0</small> */}
        </div>
        <div className="list">
          <ul className="main-class">
            <li className="line-wrapper">
              <img src="./home.svg" alt="Home Icon" />
              <p>Dashboard </p>
            </li>
            <li className="line-wrapper">
              <img src="./book.svg" alt="Home Icon" />
              <p>Booking Management </p>
            </li>
            <li className="line-wrapper">
              <img src="./user.svg" alt="Home Icon" />
              <p>Users </p>
            </li>
            <li className="line-wrapper">
              <img src="./charge.svg" alt="Home Icon" />
              <p>Charging stations </p>
            </li>
            <li className="line-wrapper">
              <img src="./charger.svg" alt="Home Icon" />
              <p>Chargers </p>
            </li>

            <li className="line-wrapper" onClick={toggleList}>
              <img src="./settings.svg" alt="Home Icon" />
              <p>Settings</p>
              <img
                src="./sidearrow.svg"
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
