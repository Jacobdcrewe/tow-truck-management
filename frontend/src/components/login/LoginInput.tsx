import React from "react";
import TextInput from "../common/TextInput";
import PasswordInput from "../common/PasswordInput";

export interface LoginInputProps {
  setUsername: React.SetStateAction<any>;
  setPassword: React.SetStateAction<any>;
}

export const LoginInput = (props: LoginInputProps) => {
  return (
    <div className="flex flex-col gap-8">
      <TextInput
        placeholder="Email/Username"
        id="username"
        onChange={(e: any) => {
          props.setUsername(e.target.value);
        }}
        required={true}
      />
      <PasswordInput
        placeholder="Password"
        id="password"
        onChange={(e: any) => {
          props.setPassword(e.target.value);
        }}
        required={true}
      />
    </div>
  );
};

export default LoginInput;
