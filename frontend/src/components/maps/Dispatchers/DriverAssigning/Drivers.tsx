import { PlusIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../ContentRouter";
import { GET, POST } from "../../../../composables/api";
import urls from "../../../../composables/urls.json";
import Loading from "../../../common/Loading";

function Drivers(props: any) {
    const { login } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [availableDrivers, setAvailableDrivers] = useState([] as any[]);
    const [loading, setLoading] = useState(true);

    async function fetchDrivers() {
        try {
            const val = await GET(`${urls.url}/api/user/`, login);
            const availDrivers = val.filter((user: any) => user.type === "DRIVER" && user.station_id === null);
            if (availDrivers && availDrivers.length > 0) {
                await setAvailableDrivers(availDrivers);
            }

        } catch (e) {
            console.error("Error fetching drivers: ", e);
        }
        setLoading(false)
    }

    async function assignDriver(driver_id: any) {
        try {
            const data = {
                user: driver_id,
                station: props.id
            }
            const val = await POST(`${urls.url}/api/user/add/station/`, data, login);
            if (val.success) {
                setShowModal(false);
                setAvailableDrivers(availableDrivers.filter((driver: any) => driver.uuid !== driver_id));
                props.fetchInfo();
            }
        } catch (e) {
            console.error("Error assigning driver: ", e);
        }
    }

    useEffect(() => {
        fetchDrivers();
    }, [login])

    return (
        <div className="w-full h-full bg-neutral-200 p-2 rounded-xl flex flex-col space-y-2">
            {loading ? <Loading /> : (
                <>

                    {
                        props.users.length > 0 ? props.users.map((user: any) => (
                            <div key={user.id} className="bg-neutral-100 p-2 rounded-xl">
                                {user.username} - {user.email}
                            </div>
                        )) :
                            <>
                                {availableDrivers.length > 0 ? <p>No drivers assigned</p> : <p>No drivers available to assign</p>}
                            </>

                    }
                    {availableDrivers.length > 0 && <div>
                        <button className="flex bg-neutral-100 rounded-xl px-4 py-2 items-center" onClick={() => { fetchDrivers(); setShowModal(true) }}>
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Assign Driver
                        </button>
                        {showModal && (
                            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-xl flex flex-col  items-center justify-center p-4 gap-4">
                                    <p className="w-full">
                                        Assign Drivers:
                                    </p>
                                    <div className=" grid grid-cols-3 gap-4 flex">
                                        {availableDrivers.map((driver: any) => (
                                            <button className="flex bg-neutral-100 rounded-xl px-4 py-2 items-center hover:bg-neutral-200" onClick={() => assignDriver(driver.uuid)}>
                                                <PlusIcon className="h-4 w-4 mr-1" />
                                                Assign {driver.username} - {driver.first_name} {driver.last_name}
                                            </button>
                                        ))
                                        }
                                    </div>
                                    <button className="ml-auto mt-auto flex bg-red-500 rounded-xl px-4 py-2 text-white items-center hover:bg-red-600" onClick={() => setShowModal(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </div>)}
                    </div>}
                </>)}
        </div>
    )
}

export default Drivers;