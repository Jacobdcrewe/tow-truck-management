import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

export function UserLayout() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);
  return (
    <>
      <Sidebar activeItem={activeItem} />
      <div className="relative flex flex-grow items-center overflow-hidden justify-center rounded-xl bg-neutral-200">
        <div className="w-full h-full flex items-center justify-center overflow-x-hidden overscroll-contain overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default UserLayout;
