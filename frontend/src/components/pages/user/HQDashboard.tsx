import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../ContentRouter";
import { GET } from "../../../composables/api";
import file from "../../../composables/urls.json";
import Map from "../../maps/Map";
import DispatchAddress from "../../maps/Dispatchers/DispatchAddress";
import AccidentAddress from "../../maps/Accidents/AccidentAddress";
import Loading from "../../common/Loading";

export function HQDashboard() {
  // const [exuser, setExUser] = useState(
  //   "(example of making api call) click me!"
  // );

  const { login } = useContext(UserContext);
  // const exampleFunction = async () => {
  //   const val = await GET(file.me, login);
  //   setExUser(JSON.stringify(val));
  // };
  const apiKey = "AIzaSyAw345vR31Ugeqi_eEde3AOs9GlMa-2i-k";
  const [dispatchers, setDispatchers] = useState([] as any);
  const [accidents, setAccidents] = useState([]);
  const [loadingAccidents, setLoadingAccidents] = useState(true);
  const [loadingDipatchers, setLoadingDispatchers] = useState(true);
  const fetchAccidents = async () => {
    try {
      const val = await GET(file.url + "/api/accident/all", login);
      if (val.success) {
        val.accidents.forEach((accident: any) => {
          accident.lng = parseFloat(accident.location.split("|")[0]);
          accident.lat = parseFloat(accident.location.split("|")[1]);
          accident.type = "ACCIDENT";
        });
        await setAccidents(val.accidents);
        setLoadingAccidents(false);
      }
    } catch (e) {
      console.error("Error fetching accidents: ", e);
    }
  };
  const fetchDispatchers = async () => {
    try {
      const val = await GET(file.url + "/api/station", login);
      if (val.success) {
        val.stations.forEach((dispatcher: any) => {
          dispatcher.lng = parseFloat(dispatcher.location.split("|")[0]);
          dispatcher.lat = parseFloat(dispatcher.location.split("|")[1]);
          dispatcher.type = "STATION"
        });

        const center = {
          type: "HQ",
          name: "HQ",
          lat: 43.657626544332,
          lng: -79.37881708145142,
        };

        await setDispatchers([center, ...val.stations]);
        setLoadingDispatchers(false);

      }
    } catch (e) {
      console.error("Error fetching dispatchers: ", e);
    }
  };

  useEffect(() => {
    fetchAccidents();
    fetchDispatchers();
  }, [login]);

  return (
    <div className="w-full h-full min-w-[330px] overscroll-x-contain">
      <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex items-center justify-center col-span-1 md:col-span-2 xl:col-span-1 flex items-center">
          <div className="rounded-xl flex items-center justify-center bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] min-h-[270px] h-[400px] w-[800px] flex items-center">
            {loadingAccidents ? (
              <Loading />
            ) : (
              <Map
                apiKey={apiKey}
                accidents={accidents}
                dispatchers={dispatchers}
                fetchAccidents={fetchAccidents}
                fetchDispatchers={fetchDispatchers}
              />
            )}
          </div>
        </div>

        <div className="rounded-xl px-4 pb-2 space-y-2 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1 md:col-span-2 xl:col-span-1 overflow-auto max-h-[400px] ">
          <p className="sticky top-0 pt-2 bg-white">Dispatchers</p>
          {loadingDipatchers === false ? (
            dispatchers.map((dispatcher: any, index: number) => (
            <DispatchAddress
              key={index}
              apiKey={apiKey}
              station={dispatcher.name}
              latitude={dispatcher.lat}
              longitude={dispatcher.lng}
            />
          ))) : <Loading />
        }
        </div>
        <div className="rounded-xl px-4 pb-2 space-y-2 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1 md:col-span-2 xl:col-span-1 overflow-auto max-h-[400px]">
          <p className="sticky top-0 pt-2 bg-white">Accidents</p>
          {loadingAccidents === false ? (
            accidents.map((accident: any, index: number) => {
              if (accident.type === "ACCIDENT") {
                return (
                  <AccidentAddress
                    key={index}
                    apiKey={apiKey}
                    latitude={accident.lat}
                    longitude={accident.lng}
                    id={accident.id}
                    dispatcher={accident.assigned_station}
                  />
                );
              }
            })
          ) : (
            <Loading />
          )}
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

export default HQDashboard;
