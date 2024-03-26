import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import {
  EyeIcon as EyeIconHover,
  EyeSlashIcon as EyeSlashHover,
} from "@heroicons/react/24/solid";
import React, { useState } from "react";

export interface PasswordInputProps {
  placeholder?: string;
  id?: string;
  name?: string;
  onChange?: (e: any) => void;
  required?: boolean;
  autocomplete?: string;
}

export const PasswordInput = (props: PasswordInputProps) => {
  const [hover, setHover] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="w-full flex h-[44px] rounded-full bg-white px-4 py-2 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] select-within:bg-black outline-none ring-none focus-within:ring focus-within:ring-2 focus-within:outline-1 focus-within:outline focus-within:outline-white focus-within:ring-white">
      <input
        className="outline-none ring-none pr-2 grow min-w-0"
        placeholder={props.placeholder}
        id={props.id}
        name={props.name}
        type={showPassword ? "text" : "password"}
        onChange={props.onChange}
        autoComplete={props.autocomplete}
        required={props.required ?? false}
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
        title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
      />
      <div
        className="h-full aspect-square cursor-pointer text-neutral-400 hover:text-neutral-300"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          hover ? (
            <EyeSlashHover />
          ) : (
            <EyeSlashIcon />
          )
        ) : hover ? (
          <EyeIconHover />
        ) : (
          <EyeIcon />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
