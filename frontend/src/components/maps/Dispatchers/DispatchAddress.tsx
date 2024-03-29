import React, { useState, useEffect, useContext } from "react";
import DispatchInfoModal from "./DispatchInfoModal";
import { GET } from "../../../composables/api";
import { UserContext } from "../../ContentRouter";
import urls from "../../../composables/urls.json";

const DispatchAddress = (props: any) => {
  const { login } = useContext(UserContext);
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userCount, setUserCount] = useState(0);
  async function fetchInfo() {
    try {
      const val = await GET(urls.url + "/api/station/" + props.id, login);
      console.log(val);
      if (val.success) {
        val.users && setUserCount(val.users.length);
      }
    } catch (e) {
      console.error("Error fetching accident info: ", e);
    }
  }
  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${props.latitude},${props.longitude}&key=${props.apiKey}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const addr = props.station
            ? props.station + ": " + data.results[0].formatted_address
            : data.results[0].formatted_address;
          setAddress(addr);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Error fetching address");
      }
    };

    fetchAddress();
    fetchInfo();
  }, [props.latitude, props.longitude]);


  return (
    <>
      {showModal && <DispatchInfoModal
        id={props.id}
        apiKey={props.apiKey}
        setModal={setShowModal}
        update={fetchInfo}
      />}
      <div className={`w-full rounded-lg bg-neutral-100 py-1 px-2 ${props.type !== "HQ" && "hover:cursor-pointer hover:bg-neutral-200"}`} onClick={() => props.type !== "HQ" && setShowModal(true)}>
        {address}
        {userCount ? <p className="ml-2">
          {userCount} assigned driver(s)
        </p> : null}

      </div>
    </>

  );
};

export default DispatchAddress;
