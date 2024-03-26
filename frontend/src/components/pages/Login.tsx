import React, { useState, useContext } from "react";
import { LoginPageButton } from "../login/LoginPageButton";
import LoginInput from "../login/LoginInput";
import logo from "../../assets/images/logo.svg";
import { useNavigate } from "react-router-dom";
import { POST } from "../../composables/api";
import urls from "../../composables/urls.json";
import { UserContext } from "../ContentRouter";
import Loading from "../common/Loading";

export function Login() {
  const { setLogin } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function signIn() {
    setLoading(true);
    const data = {
      password: password,
      username: username,
    };
    try {
      const token_vals = {
        success: true,
        access_token: "",
        refresh_token: "",
        token_type: "",
      };
      // const token_vals = await POST(urls.login, data);
      console.log(token_vals);
      if (token_vals.success) {
        setLoading(false);
        setLogin(token_vals);
        navigate("/user/dashboard");
      }
    } catch (e) {
      setLoading(false);
      setError("Incorrect Username or Password");
      console.error("Error logging in: ", e);
    }
  }

  return (
    <div className="flex flex-grow items-center justify-center rounded-xl bg-gradient-to-t from-black to-neutral-800 overflow-hidden ">
      <div className="w-full h-full flex items-center justify-center overflow-x-hidden overscroll-contain overflow-auto p-4">
        <div className="pt-4 h-full flex flex-col items-center w-full md:w-[34rem]">
          <div className="w-full flex items-center justify-center min-h-[3.75rem] max-h-[180px] gap-4">
            <img
              src={logo}
              alt="logo"
              className="max-w-[3.75rem] object-contain aspect-square md:my-10 mb-14 md:mb-20"
            />
            <p className="text-6xl text-neutral-100 md:my-10 mb-14 md:mb-20 text-center">
              Tow Trucks
            </p>
          </div>

          <div
            className={`relative p-10 w-full min-h-[380px] h-[380px] flex flex-col bg-neutral-100 rounded-xl overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.8)] transition-all ease-in-out duration-300`}
          >
            <div className="h-[72px] max-h-[72px] min-h-[72px] flex flex-col">
              <h1 className="text-2xl font-semibold">Login</h1>
              <p className="text-red-500 mt-auto">{error}</p>
            </div>
            <form
              className="flex flex-col flex-grow gap-10 text-xl"
              onSubmit={async (event) => {
                event.preventDefault();
                await signIn();
              }}
            >
              <LoginInput setUsername={setUsername} setPassword={setPassword} />
              <div className="mt-auto w-full flex flex-col items-center justify-center gap-4">
                <LoginPageButton
                  prompt={loading ? <Loading /> : "Login"}
                  id="login"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
