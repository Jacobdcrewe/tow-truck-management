import React from "react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { HomeIcon as HomeIconSelected } from "@heroicons/react/24/solid";
import { ISidebarItemModel } from "../models/ISidebarItemModel";

export const Routes: Array<ISidebarItemModel> = [
  {
    icon: <HomeIcon className="w-full h-full" />,
    selectedIcon: <HomeIconSelected className="w-full h-full" />,
    text: "Dashboard",
    href: "/user/dashboard",
    needsLogin: false,
  },
].filter((value: ISidebarItemModel) => {
  return value.needsLogin === false;
});

export default Routes;
