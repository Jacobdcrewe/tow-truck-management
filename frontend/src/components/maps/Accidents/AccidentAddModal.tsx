import React, { useContext, useEffect, useState } from "react";
import Loading from "../../common/Loading";
import urls from "../../../composables/urls.json";
import { UserContext } from "../../ContentRouter";
import { POST } from "../../../composables/api";

function AccidentAddModal(props: any) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const { login } = useContext(UserContext);
  const [closestDispatchers, setClosestDispatchers] = useState({} as any);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${props.accidentLocation.lat},${props.accidentLocation.lng}&key=${props.apiKey}`
        );
        const data = await response.json();
        setLoading(false);
        if (data.results && data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
          findClosestDispatchers(
            props.accidentLocation.lat,
            props.accidentLocation.lng
          );
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
        const closestDispatcher = sortedDispatchers.slice(0, 1)[0];

        setClosestDispatchers(closestDispatcher);
      } catch (error) {
        console.error("Error fetching dispatchers:", error);
        setClosestDispatchers({});
      }
    };
    fetchAddress();
  }, [
    props.showModal,
    props.dispatchers,
    props.accidentLocation.lat,
    props.accidentLocation.lng,
  ]);

  async function saveAccident() {
    setLoadingSave(true);
    try {
      const description = (
        document.getElementById("accident-description") as HTMLTextAreaElement
      )?.value;
      const data = {
        description: description,
        location: props.accidentLocation.lng + "|" + props.accidentLocation.lat,
      };
      const val = await POST(urls.url + "/api/accident/report", data, login);
      if (val.success) {
        setLoadingSave(false);
      }
    } catch (e) {
      setLoadingSave(false);
      console.error("Error saving accident: ", e);
    }
  }
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl flex items-center justify-center p-4  w-[800px] h-[400px]">
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
              <p>Assigned Station:</p>
              <h2 className="text-lg bg-neutral-100 p-2 rounded-xl">
                {closestDispatchers.name} - {closestDispatchers.duration}{" "}
                seconds
              </h2>
            </div>
            <textarea
              id="accident-description"
              placeholder="Enter accident description"
              className="mt-2 bg-neutral-100 rounded-xl p-2 w-full h-full resize-none"
            />
            <div className="flex w-full">
              <button
                className="ml-auto bg-green-500 text-white rounded-xl w-1/6 p-2 hover:bg-green-600 "
                onClick={() => {
                  saveAccident();
                  props.onSave();
                }}
              >
                {loadingSave ? <Loading /> : "Submit"}
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

export default AccidentAddModal;
