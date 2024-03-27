import React, { useContext, useEffect, useState } from "react";
import Loading from "../common/Loading";
import urls from "../../composables/urls.json";
import { UserContext } from "../ContentRouter";
import { GET, POST } from "../../composables/api";

function AccidentInfoModal(props: any) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const { login } = useContext(UserContext);
  useEffect(() => {
    const fetchAddress = async (lat: any, lng: any) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${props.apiKey}`
        );
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setAddress(data.results[0].formatted_address);
        } else {
          setAddress("Address not found");
        }
      } catch (error) {
        console.error("Error fetching address:", error);
        setAddress("Error fetching address");
      }
    };

    const fetchInfo = async () => {
      try {
        const val = await GET(urls.url + "/api/accident/" + props.id, login);
        console.log(val);
        if (val.success) {
          setDescription(val.description);
          await fetchAddress(
            val.location.split("|")[1],
            val.location.split("|")[0]
          );
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        console.error("Error fetching accident info: ", e);
      }
    };
    fetchInfo();
  }, [props.id]);

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
        props.setModal(false);
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
            <p>Description: </p>
            <p
              id="accident-description"
              className="bg-neutral-100 rounded-xl p-2 w-full resize-none"
            >
              {description}
            </p>
            <div className="mt-auto flex w-full">
              <button
                className="ml-auto bg-red-500 text-white rounded-xl w-1/6 p-2 hover:bg-red-600"
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
