import React, { useContext, useEffect, useState } from "react";
import Loading from "../../common/Loading";
import urls from "../../../composables/urls.json";
import { UserContext } from "../../ContentRouter";
import { GET, PUT } from "../../../composables/api";
import Chat from "./Chat";
import { Info } from "@mui/icons-material";

function AccidentInfoModal(props: any) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("");
  const [dispatcher, setDispatcher] = useState("");
  const [assignedDriver, setAssignedDriver] = useState({} as any);
  const { login } = useContext(UserContext);
  const [optionSelected, setOptionSelected] = useState("");
  const [info, setInfo] = useState({} as any);
  
  useEffect(() => {
    const fetchAddress = async (lat: any, lng: any) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${props.apiKey}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].formatted_address;
        } else {
          return "Address not found";
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        return "Error fetching address";
      }
    };

    const fetchInfo = async () => {
      try {
        const val = await GET(urls.url + "/api/accident/" + props.id, login);
        console.log(val);
        if (val.success) {
          setDescription(val.description);
          setAddress(await fetchAddress(
            val.location.split("|")[1],
            val.location.split("|")[0],
          ));

          setInfo(val);
          setDispatcher(val.assigned_station.name + " - " + await fetchAddress(val.assigned_station.location.split("|")[1], val.assigned_station.location.split("|")[0]));
          setAssignedDriver(val.assigned_to);
          setOptionSelected(val.status);
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        console.error("Error fetching accident info: ", e);
      }
    };
    fetchInfo();
  }, [props.id]);

  async function saveChanges(id: any) {
    try {
      const sentInfo = {
        status: optionSelected,
        reported_by: info.reported_by,
        assigned_to: info.assigned_to,
        assigned_station: info.assigned_station
      };
      const data = await PUT(urls.url + "/api/accident/" + id + "/status", sentInfo, login);
      props.setModal(false);

      if (data.success) {
      } else {
        console.error("Error saving changes: ", data);
      }

    } catch (error) {
      console.error("Error saving changes: ", error);
    }
  }

  const options = ["REPORTED", "ON_THE_WAY", "PICKED_UP", "COMPLETED"];
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl flex items-center justify-center p-4  w-[800px] min-h-[400px]">
        {loading ? (
          <Loading />
        ) : (
          <div className="w-full h-full flex flex-col gap-2 relative">
            <div className="top-0 space-y-2">
              <p>Accident Address:</p>
              <h2 className="text-lg bg-neutral-100 p-2 rounded-xl">
                {address}
              </h2>
            </div>
            <div className="top-0 space-y-2">
              <p>Truck Dispatcher:</p>
              <h2 className="text-lg bg-neutral-100 p-2 rounded-xl">
                {assignedDriver && assignedDriver.username ? assignedDriver.username + ": " + dispatcher : dispatcher}
              </h2>
            </div>
            <div>
              <p>Status:</p>
              <select
                className={`rounded-xl text-lg w-full rounded-full px-4 py-2 shadow-[inset_0_0_4px_rgba(0,0,0,0.2)] outline-white ${optionSelected ? "text-black" : "text-neutral-400"
                  }`}
                onChange={(e: any) => {
                  setOptionSelected(e.target.value);
                }}
                value={optionSelected}
              >
                {options.map((option, index) => (
                  <option key={index} value={option}>
                    {option.split("_").join(" ")}
                  </option>
                ))}
              </select>
            </div>
            <p>Description: </p>
            <p
              id="accident-description"
              className="bg-neutral-100 rounded-xl p-2 w-full resize-none"
            >
              {description}
            </p>
            <div className="h-full flex flex-col w-full space-y-2">
              Comments:
              <Chat id={props.id} />
            </div>
            <div className="mt-auto flex w-full">
            <button
                className="ml-auto bg-green-500 text-white rounded-xl w-1/6 p-2 hover:bg-green-600"
                onClick={() => saveChanges(props.id)}
              >
                Submit
              </button>
              <button
                className="ml-2 bg-red-500 text-white rounded-xl w-1/6 p-2 hover:bg-red-600"
                onClick={() => props.setModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccidentInfoModal;
