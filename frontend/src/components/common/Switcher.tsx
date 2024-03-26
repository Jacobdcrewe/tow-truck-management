import { FireIcon, TruckIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

const Switcher = (props: any) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    props.setMarkerType(isChecked ? "station" : "accident");
  };

  return (
    <div className={props.className}>
      <label className="themeSwitcherTwo shadow-card relative inline-flex cursor-pointer select-none items-center justify-center rounded-md bg-white p-1">
        <input
          type="checkbox"
          className="sr-only"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
            !isChecked ? "text-primary bg-[#f4f7ff]" : "text-body-color"
          }`}
        >
          <TruckIcon className="h-[16px] w-[16px] mr-[6px]" />
          Add Dispatchers
        </span>
        <span
          className={`flex items-center space-x-[6px] rounded py-2 px-[18px] text-sm font-medium ${
            isChecked ? "text-primary bg-[#f4f7ff]" : "text-body-color"
          }`}
        >
          <FireIcon className="h-[16px] w-[16px] mr-[6px]" />
          Add Accidents
        </span>
      </label>
    </div>
  );
};

export default Switcher;
