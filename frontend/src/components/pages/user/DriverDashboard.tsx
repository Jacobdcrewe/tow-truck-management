import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../ContentRouter";
import { GET } from "../../../composables/api";
import file from "../../../composables/urls.json";
import Map from "../../maps/Map";
import DispatchAddress from "../../maps/Dispatchers/DispatchAddress";
import AccidentAddress from "../../maps/Accidents/AccidentAddress";

export function DriverDashboard() {
  // const [exuser, setExUser] = useState(
  //   "(example of making api call) click me!"
  // );

  const { login } = useContext(UserContext);
  // const exampleFunction = async () => {
  //   const val = await GET(file.me, login);
  //   setExUser(JSON.stringify(val));
  // };
  const apiKey = "AIzaSyAw345vR31Ugeqi_eEde3AOs9GlMa-2i-k";
  const [dispatchers, setDispatchers] = useState([]);
  return (
    <div className="w-full h-full min-w-[330px] overscroll-x-contain">
      <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex items-center justify-center col-span-1 md:col-span-2 xl:col-span-1 flex items-center">
          <div className="rounded-xl flex items-center justify-center bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] min-h-[270px] h-[400px] w-[800px] flex items-center"></div>
        </div>

        <div className="rounded-xl px-4 pb-2 space-y-2 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1 md:col-span-2 xl:col-span-1 overflow-auto max-h-[400px] "></div>
        <div className="rounded-xl px-4 pb-2 space-y-2 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1 md:col-span-2 xl:col-span-1 overflow-auto max-h-[400px]">
          <p className="sticky top-0 pt-2 bg-white">Accidents</p>
          {dispatchers.map((dispatcher: any, index: number) => {
            if (dispatcher.type === "ACCIDENT") {
              return (
                <AccidentAddress
                  key={index}
                  apiKey={apiKey}
                  latitude={dispatcher.lat}
                  longitude={dispatcher.lng}
                  dispatchers={dispatchers.filter(
                    (type: any) =>
                      type.type !== "ACCIDENT" && type.type !== "HQ"
                  )}
                />
              );
            }
            return null;
          })}
        </div>
        {/* <div
          className="rounded-xl p-4 py-2 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] hover:cursor-pointer overscroll-contain overflow-auto col-span-1 md:col-span-2"
          onClick={exampleFunction}
        >
          <p>{exuser}</p>
        </div> */}
      </div>
    </div>
  );
}

export default DriverDashboard;
