import React, { useState } from "react";

export interface DropDownInputProps {
  placeholder?: string;
  id?: string;
  name?: string;
  onChange?: (e: any) => void;
  required?: boolean;
  autocomplete?: string;
  options: string[];
}

export const DropDownInput = (props: DropDownInputProps) => {
  const [optionSelected, setOptionSelected] = useState<boolean>(false);
  return (
    <select
      className={`w-full rounded-full px-4 py-2 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] outline-white ${
        optionSelected ? "text-black" : "text-neutral-400"
      }`}
      id={props.id}
      name={props.name}
      onChange={(e: any) => {
        setOptionSelected(true);
        if (props.onChange) {
          props.onChange(e);
        }
      }}
      autoComplete={props.autocomplete}
      required={props.required ?? false}
    >
      <option hidden value={""} className="text-neutral-200">
        {props.placeholder || "Select an option"}
      </option>
      {props.options.map((option, index) => (
        <option key={index} value={option}>
          {option.split("_").join(" ")}
        </option>
      ))}
    </select>
  );
};

export default DropDownInput;
