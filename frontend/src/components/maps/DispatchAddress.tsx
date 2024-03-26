import React, { useState, useEffect } from "react";

const DispatchAddress = (props: any) => {
  const [address, setAddress] = useState("");

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
  }, [props.latitude, props.longitude]);

  return (
    <div className="w-full rounded-lg bg-neutral-100 py-1 px-2">{address}</div>
  );
};

export default DispatchAddress;
