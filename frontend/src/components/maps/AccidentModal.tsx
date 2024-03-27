import React, {useState} from "react";

function AccidentModal(props: any) {
    const [address, setAddress] = useState("");
    const fetchAddress = async () => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${props.accidentLocation.lat},${props.accidentLocation.lng}&key=${props.apiKey}`
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

    fetchAddress();
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-4">
                <p>{address}</p>
            </div>
        </div>
    );
}

export default AccidentModal;