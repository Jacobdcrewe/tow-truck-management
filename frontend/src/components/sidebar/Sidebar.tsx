import {
  ArrowUpOnSquareIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { ArrowUpOnSquareIcon as ArrowUpOnSquareIconSelected } from "@heroicons/react/24/solid";
import React, { useState, useEffect, useContext } from "react";
import { ISidebarItemModel } from "../../models/ISidebarItemModel";
import SidebarItem from "./SidebarItem";
import Routes from "../Routes";
import { UserContext } from "../ContentRouter";
import BottomItem from "./BottomItem";

function Sidebar(props: any) {
  const { setLogin } = useContext(UserContext);

  const [expand, setExpand] = useState(() => {
    const setSize = sessionStorage.getItem("expandSidebar");
    return JSON.parse(setSize!) ?? true;
  });

  useEffect(() => {
    sessionStorage.setItem("expandSidebar", JSON.stringify(expand));
  }, [expand]);

  let logoutItem = {
    icon: <ArrowUpOnSquareIcon className="w-full h-full rotate-90" />,
    selectedIcon: (
      <ArrowUpOnSquareIconSelected className="w-full h-full rotate-90" />
    ),
    text: "Logout",
    needsLogin: false,
  };
  return (
    <>
      <aside
        className={`relative transition-all ease-in-out duration-300 rounded-xl text-white left-0 mr-2 ${
          expand ? "w-72" : "w-[5.5rem]"
        } flex-none h-full bg-stone-950 overflow-hidden hidden md:flex md:flex-col p-4`}
      >
        <div className="w-full">
          <div
            className="text-neutral-300 ml-auto w-fit mt-2 mb-4 mx-1 hover:cursor-pointer hover:text-white"
            onClick={() => setExpand(!expand)}
          >
            <ChevronRightIcon
              className={`w-6 h-6 transition-all ease-in-out duration-200 ${
                expand ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </div>

        {Routes.map((value: ISidebarItemModel) => (
          <div className="w-full mb-4" key={value.href}>
            <SidebarItem
              item={value}
              expand={expand}
              active={props.activeItem === value.href}
            />
          </div>
        ))}
        <div className="w-full mt-auto bottom-0">
          <SidebarItem
            item={logoutItem}
            handleClick={() => {
              setLogin("");
              localStorage.removeItem("userLogin");
            }}
            expand={expand}
          />
        </div>
      </aside>
      <aside
        className={`order-2 transition-all ease-in-out duration-300 rounded-xl text-white bottom-0 mt-1 flex-none w-full bg-stone-950 overflow-hidden flex grid grid-cols-6 gap-3 place-items-center max-h-26 items-center justify-center md:hidden p-4`}
      >
        {Routes.map((value: ISidebarItemModel) => (
          <div className="aspect-square h-full m-2 max-h-16" key={value.href}>
            <BottomItem item={value} active={props.activeItem === value.href} />
          </div>
        ))}
        <div className="aspect-square h-full m-2 max-h-16">
          <BottomItem
            item={logoutItem}
            handleClick={() => {
              setLogin("");
              localStorage.removeItem("userLogin");
            }}
          />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
