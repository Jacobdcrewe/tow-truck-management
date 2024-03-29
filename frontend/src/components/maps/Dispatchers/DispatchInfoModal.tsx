import React, { useContext, useEffect, useState } from "react";
import Loading from "../../common/Loading";
import urls from "../../../composables/urls.json";
import { UserContext } from "../../ContentRouter";
import { GET, POST } from "../../../composables/api";
import Drivers from "./DriverAssigning/Drivers";

function DispatchInfoModal(props: any) {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);
    const { login } = useContext(UserContext);
    const [dispatchName, setDispatchName] = useState("");
    const [users, setUsers] = useState([] as any[]);

    async function fetchAddress(lat: any, lng: any) {
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
    async function fetchInfo() {
        try {
            const val = await GET(urls.url + "/api/station/" + props.id, login);
            console.log(val);
            if (val.success) {
                // setDescription(val.description);
                setAddress(await fetchAddress(
                    val.location.split("|")[1],
                    val.location.split("|")[0],
                ));

                setDispatchName(val.name);
                setUsers(val.users);

                setLoading(false);
            }
        } catch (e) {
            setLoading(false);
            console.error("Error fetching accident info: ", e);
        }
    };
    useEffect(() => {



        fetchInfo();
    }, [props.id]);

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl flex items-center justify-center p-4  w-[800px] min-h-[300px]">
                {loading ? (
                    <Loading />
                ) : (
                    <div
                        className="w-full h-full flex flex-col gap-2 relative"
                    >
                        <h1 className="text-2xl">Add Dispatcher</h1>
                        <div className="top-0 space-y-2">
                            <div>
                                <p>Dispatcher Address:</p>
                                <h2 className="text-lg bg-neutral-100 p-2 rounded-xl">
                                    {address}
                                </h2>
                            </div>

                            <div>
                                <p>Dispatcher Name:</p>
                                <h2 className="text-lg bg-neutral-100 p-2 rounded-xl">
                                    {dispatchName}
                                </h2>
                            </div>

                        </div>

                        <div>
                            <p>
                                Drivers Assigned to Station:
                            </p>
                            <div className="w-full h-full">
                                <Drivers id={props.id} users={users} fetchInfo={fetchInfo} />
                            </div>
                        </div>
                        <div className="mt-auto w-full flex">
                            <button
                                className="ml-auto bg-red-500 text-white rounded-xl w-1/6 p-2 hover:bg-red-600"
                                onClick={() => {
                                    props.update();
                                    props.setModal(false)
                                }}
                            >
                                Exit
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default DispatchInfoModal;
