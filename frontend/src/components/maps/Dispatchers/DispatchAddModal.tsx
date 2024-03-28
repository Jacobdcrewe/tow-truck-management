import React, { useContext, useEffect, useState } from "react";
import Loading from "../../common/Loading";
import urls from "../../../composables/urls.json";
import { UserContext } from "../../ContentRouter";
import { POST } from "../../../composables/api";

function DispatchAddModal(props: any) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const { login } = useContext(UserContext);
  const [dispatchName, setDispatchName] = useState("");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${props.dispatchLocation.lat},${props.dispatchLocation.lng}&key=${props.apiKey}`
        );
        const data = await response.json();
        setLoading(false);
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
    fetchAddress();
  }, [
    props.showModal,
    props.dispatchers,
    props.dispatchLocation.lat,
    props.dispatchLocation.lng,
  ]);

  async function saveDispatcher() {
    setLoadingSave(true);
    try {
      const data = {
        name: dispatchName,
        location: props.dispatchLocation.lng + "|" + props.dispatchLocation.lat,
      };
      const val = await POST(urls.url + "/api/station", data, login);
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
      <div className="bg-white rounded-xl flex items-center justify-center p-4  w-[800px] h-[300px]">
        {loading ? (
          <Loading />
        ) : (
          <form
            className="w-full h-full flex flex-col gap-2 relative"
            onSubmit={() => {
              saveDispatcher();
              props.onSave();
            }}
          >
            <h1 className="text-2xl">Add Dispatcher</h1>
            <div className="top-0 space-y-2">
              <p>Dispatcher Address:</p>
              <h2 className="text-lg bg-neutral-100 p-2 rounded-xl">
                {address}
              </h2>
            </div>
            <input
              type="text"
              placeholder="Station Name"
              className="bg-neutral-100 rounded-xl p-2 w-full text-lg resize-none"
              required={true}
              value={dispatchName}
              onChange={(e) => setDispatchName(e.target.value)}
            />
            <div className="flex w-full mt-auto">
              <button className="ml-auto bg-green-500 text-white rounded-xl w-1/6 p-2 hover:bg-green-600 ">
                {loadingSave ? <Loading /> : "Submit"}
              </button>
              <button
                className="ml-2 bg-red-500 text-white rounded-xl w-1/6 p-2 hover:bg-red-600"
                onClick={() => props.setModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default DispatchAddModal;
