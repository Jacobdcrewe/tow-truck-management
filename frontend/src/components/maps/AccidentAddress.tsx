import React, { useState, useEffect } from "react";
import AccidentInfoModal from "./AccidentInfoModal";

const AccidentAddress = (props: any) => {
  const [address, setAddress] = useState("");
  const [closestDispatchers, setClosestDispatchers] = useState([] as any);
  const [showModal, setShowModal] = useState(false);

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
          findClosestDispatchers(props.latitude, props.longitude);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Error fetching address");
      }
    };

    const findClosestDispatchers = async (latitude: any, longitude: any) => {
      try {
        const dispatchers = props.dispatchers;
        const service = new window.google.maps.DistanceMatrixService();
        const dispatchersWithRoutes = await Promise.all(
          dispatchers.map(async (dispatcher: any) => {
            return new Promise((resolve, reject) => {
              service.getDistanceMatrix(
                {
                  origins: [{ lat: latitude, lng: longitude }],
                  destinations: [{ lat: dispatcher.lat, lng: dispatcher.lng }],
                  travelMode: google.maps.TravelMode.DRIVING,
                },
                (response, status) => {
                  if (
                    status === "OK" &&
                    response &&
                    response.rows &&
                    response.rows.length > 0 &&
                    response.rows[0].elements &&
                    response.rows[0].elements.length > 0
                  ) {
                    const duration =
                      response.rows[0].elements[0].duration.value; // Duration in seconds
                    resolve({ ...dispatcher, duration });
                  } else {
                    reject("Error fetching distance matrix");
                  }
                }
              );
            });
          })
        );

        const sortedDispatchers = dispatchersWithRoutes.sort(
          (a, b) => a.duration - b.duration
        );
        const closestDispatcher = sortedDispatchers.slice(0, 1);
        setClosestDispatchers(closestDispatcher);
      } catch (error) {
        console.error("Error fetching dispatchers:", error);
        setClosestDispatchers([]);
      }
    };

    fetchAddress();
  }, [props.address, props.dispatchers]);

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
          {closestDispatchers.map((dispatcher: any, index: any) => (
            <h2>
              Closest Dispatchers: {dispatcher.name} - {dispatcher.duration}{" "}
              seconds
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccidentAddress;
