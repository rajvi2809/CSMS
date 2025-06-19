import { useState } from "react";
import { useSelector } from "react-redux";

export default function Header() {
  const users = useSelector((state) => state.users.users);
  const [sideBar, setSideBar] = useState(false);
  const toggleSideBar = () => {
    setSideBar(!sideBar);
  };

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
    </>
  );
}
