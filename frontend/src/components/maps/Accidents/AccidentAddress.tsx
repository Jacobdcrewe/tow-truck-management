import React, { useState, useEffect } from "react";
import AccidentInfoModal from "./AccidentInfoModal";

const AccidentAddress = (props: any) => {
  const [address, setAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  async function fetchAddress (latitude:any, longitude:any, setState:React.SetStateAction<any>) {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${props.apiKey}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const addr = props.station
          ? props.station + ": " + data.results[0].formatted_address
          : data.results[0].formatted_address;
        setState(addr);
      } else {
        setState("Address not found");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      setState("Error fetching address");
    }
  };


  useEffect(() => {
    fetchAddress(props.latitude, props.longitude, setAddress);
  }, [props.address, props.dispatcher, props.latitude, props.longitude]);

  return (
    <div id={props.id}>
      {showModal && (
        <AccidentInfoModal
          apiKey={props.apiKey}
          accidentLocation={{ lat: props.latitude, lng: props.longitude }}
          setModal={setShowModal}
          id={props.id}
        />
      )}
      <div
        className="w-full rounded-lg bg-neutral-100 py-1 px-2 hover:cursor-pointer hover:bg-neutral-200"
        onClick={() => setShowModal(true)}
      >
        {address}
        <div className="ml-2">
          Assigned Station: {props.dispatcher.name}
        </div>
      </div>
    </div>
  );
};

export default AccidentAddress;
