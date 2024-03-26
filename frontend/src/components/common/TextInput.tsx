import React from "react";

export interface TextInputProps {
  placeholder?: string;
  id?: string;
  name?: string;
  onChange?: (e: any) => void;
  required?: boolean;
  autocomplete?: string;
}

export const TextInput = (props: TextInputProps) => {
  return (
    <input
      className="w-full rounded-full px-4 py-2 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] outline-white"
      placeholder={props.placeholder}
      id={props.id}
      name={props.name}
      type="text"
      onChange={props.onChange}
      autoComplete={props.autocomplete}
      required={props.required ?? false}
    />
  );
};

export default TextInput;
