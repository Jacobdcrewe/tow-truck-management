import React, { useEffect, useState } from "react";
import { ISidebarItemModel } from "../../models/ISidebarItemModel";
import { NavLink } from "react-router-dom";

export interface BottomItemProps {
  item: ISidebarItemModel;
  expand: boolean;
}

export function BottomItem(props: any) {
  let item: ISidebarItemModel = props.item;
  const [isActive, setIsActive] = useState(props.active);
  const [hovering, setHovering] = useState(isActive);
  useEffect(() => {
    setIsActive(props.active);
    setHovering(props.active);
  }, [props.active]);
  if (!item?.href) {
    return (
      <button className="w-full" onClick={props.handleClick}>
        <div
          className={`h-full flex items-center justify-center rounded-xl bg-stone-900 p-3 flex flex-none items-center aspect-square`}
          style={{
            backgroundColor: isActive ? "rgb(41 37 36)" : "rgb(28 25 23)",
            fontWeight: isActive || hovering ? "400" : "300",
          }}
          onMouseEnter={() => {
            if (!isActive) {
              setHovering(true);
            }
          }}
          onMouseLeave={() => {
            if (!isActive) {
              setHovering(false);
            }
          }}
        >
          <div className="flex-none w-full h-full">
            {hovering ? item.selectedIcon : item.icon}
          </div>
        </div>
      </button>
    );
  } else {
    return (
      <NavLink to={item.href}>
        <div
          className={`h-full flex items-center justify-center rounded-xl bg-stone-900 p-3 flex flex-none items-center aspect-square`}
          style={{
            backgroundColor: isActive ? "rgb(41 37 36)" : "rgb(28 25 23)",
            fontWeight: isActive || hovering ? "400" : "300",
          }}
          onMouseEnter={() => {
            if (!isActive) {
              setHovering(true);
            }
          }}
          onMouseLeave={() => {
            if (!isActive) {
              setHovering(false);
            }
          }}
        >
          <div className="flex-none w-full h-full">
            {hovering ? item.selectedIcon : item.icon}
          </div>
        </div>
      </NavLink>
    );
  }
}

export default BottomItem;
