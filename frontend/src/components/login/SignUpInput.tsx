import React from "react";
import TextInput from "../common/TextInput";
import EmailInput from "../common/EmailInput";
import PasswordInput from "../common/PasswordInput";
import NumberInput from "../common/NumberInput";
import DropDownInput from "../common/DropDownInput";

export interface SignUpInputProps {
  setUsername: React.SetStateAction<any>;
  setFirstName: React.SetStateAction<any>;
  setLastName: React.SetStateAction<any>;
  setPassword: React.SetStateAction<any>;
  setEmail: React.SetStateAction<any>;
  setType: React.SetStateAction<any>;
  setError: React.SetStateAction<any>;
}

export const SignUpInput = (props: SignUpInputProps) => {
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="md:w-1/2 ">
          <TextInput
            placeholder="First Name"
            id="fName"
            onChange={(e: any) => {
              props.setFirstName(e.target.value);
            }}
            required={true}
            autocomplete="off"
          />
        </div>
        <div className="md:w-1/2 ">
          <TextInput
            placeholder="Last Name"
            id="lName"
            onChange={(e: any) => {
              props.setLastName(e.target.value);
            }}
            required={true}
            autocomplete="off"
          />
        </div>
      </div>
      <EmailInput
        placeholder="Email"
        id="email"
        onChange={(e: any) => {
          props.setEmail(e.target.value);
        }}
        required={true}
        autocomplete="off"
      />
      <TextInput
        placeholder="Username"
        id="username"
        onChange={(e: any) => {
          props.setUsername(e.target.value);
        }}
        required={true}
        autocomplete="new-username"
      />
      <PasswordInput
        placeholder="Password"
        id="password"
        onChange={(e: any) => {
          props.setPassword(e.target.value);
        }}
        required={true}
        autocomplete="new-password"
      />
      <DropDownInput
        options={["HQ_EMPLOYEE", "DRIVER"]}
        placeholder="Select Role"
        id="role"
        onChange={(e: any) => {
          if (e.target.value === "") {
            props.setError("Please select a role");
          } else {
            props.setType(e.target.value);
          }
        }}
        required={true}
        autocomplete="off"
      />
    </div>
  );
};

export default SignUpInput;
