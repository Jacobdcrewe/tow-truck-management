import React from "react";
import TextInput from "../common/TextInput";
import EmailInput from "../common/EmailInput";
import PasswordInput from "../common/PasswordInput";
import NumberInput from "../common/NumberInput";

export interface SignUpInputProps {
  setUsername: React.SetStateAction<any>;
  setFirstName: React.SetStateAction<any>;
  setLastName: React.SetStateAction<any>;
  setPassword: React.SetStateAction<any>;
  setEmail: React.SetStateAction<any>;
  setAge: React.SetStateAction<any>;
  setHeight: React.SetStateAction<any>;
  setWeight: React.SetStateAction<any>;
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
      <div className="flex flex-col md:flex-row w-full gap-2">
        <div className="md:w-1/3">
          <NumberInput
            placeholder="Age"
            id="age"
            onChange={(e: any) => {
              props.setAge(e.target.value);
            }}
            required={true}
            autocomplete="new-age"
            min={0}
          />
          </div>
          <div className="md:w-1/3">
          <NumberInput
            placeholder="Weight (kg)"
            id="weight"
            onChange={(e: any) => {
              props.setWeight(e.target.value);
            }}
            required={true}
            autocomplete="new-weight"
            min={0}
          />
          </div>
          <div className="md:w-1/3">
          <NumberInput
            placeholder="Height (cm)"
            id="height"
            onChange={(e: any) => {
              props.setHeight(e.target.value);
            }}
            required={true}
            autocomplete="new-height"
            min={0}
          />
          </div>

      </div>
    </div>
  );
};

export default SignUpInput;
