import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./pages/UserLayout";
import Login from "./pages/Login";
import HQDashboard from "./pages/user/HQDashboard";
import { ILoginModel, ITokenModel } from "../models/ITokenModel";
import DriverDashboard from "./pages/user/DriverDashboard";

const defaultLogin: ITokenModel = {
  success: false,
  access_token: "",
  refresh_token: "",
  token_type: "",
};

export const UserContext = createContext({} as ILoginModel);

export function ContentRouter() {
  const [login, setLogin] = useState(() => {
    const savedLogin = localStorage.getItem("userLogin");
    return savedLogin ? JSON.parse(savedLogin) : defaultLogin;
  });

  const [accountType, setAccountType] = useState(() => {
    const savedAccountType = localStorage.getItem("accountType");
    return savedAccountType ? JSON.parse(savedAccountType) : "";
  });
  useEffect(() => {
    localStorage.setItem("userLogin", JSON.stringify(login));
  }, [login]);

  useEffect(() => {
    localStorage.setItem("accountType", JSON.stringify(accountType));
  }, [accountType]);

  return (
    <UserContext.Provider
      value={{
        login: login,
        setLogin: setLogin,
        accountType: accountType,
        setAccountType: setAccountType,
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              login.success ? (
                accountType === "HQ_EMPLOYEE" ? (
                  <Navigate to="hq/dashboard" />
                ) : (
                  accountType === "DRIVER" && <Navigate to="driver/dashboard" />
                )
              ) : (
                <Login />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
          {login.success && accountType === "HQ_EMPLOYEE" && (
            <Route path="hq" element={<UserLayout />}>
              <Route path="*" element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<HQDashboard />} />
            </Route>
          )}
          {login.success && accountType === "DRIVER" && (
            <Route path="driver" element={<UserLayout />}>
              <Route path="*" element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<DriverDashboard />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default ContentRouter;
