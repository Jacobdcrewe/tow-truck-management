import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Switcher from "../common/Switcher";
import AccidentModal from "./AccidentModal";

function Map(props: any) {
  const containerStyle = {
    width: "800px",
    height: "400px",
  };

  const center = {
    type: "HQ",
    name: "HQ",
    lat: 43.657626544332,
    lng: -79.37881708145142,
  };

  const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    draggable: false,
    clickableIcons: false,
  };

  const markerIconURL = {
    station: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    accident: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  };

  const [markers, setMarkers] = useState([] as any);
  const [markerType, setMarkerType] = useState("station");
  const [showModal, setShowModal] = useState(false);
  const [accidentLocation, setAccidentLocation] = useState({} as any);
  const handleMapClick = (event: any) => {
    const newMarker = {
      type: markerType.toUpperCase(),
      name: markerType.toUpperCase() + " " + (markers.length + 1),
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    if (markerType.toUpperCase() === "ACCIDENT") {
      setShowModal(true);
      setAccidentLocation(newMarker);
    } else {
      if (markers.length > 0) {
        setMarkers((prevMarkers: any) => [...prevMarkers, newMarker]);
      } else {
        setMarkers([center, newMarker]);
      }
    }
    
  };

  useEffect(() => {
    props.setDispatchers(markers);
  }, [markers]);

  return (
    <>
      {showModal && <AccidentModal accidentLocation={accidentLocation} apiKey={props.apiKey} />}
      <div className="w-full h-full flex items-center justify-center relative">
        <Switcher
          className="absolute left-0 bottom-0 m-2 z-10"
          setMarkerType={setMarkerType}
        />
        <LoadScript googleMapsApiKey={props.apiKey}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onClick={handleMapClick}
            options={mapOptions}
          >
            {markers.map((marker: any, index: any) => (
              <Marker
                key={index}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  url: markerIconURL[
                    marker.type.toLowerCase() as keyof typeof markerIconURL
                  ],
                  scaledSize: new window.google.maps.Size(30, 30), // Adjust size if needed
                }}
                onClick={() => {
                  setMarkers((prevMarkers: any) => {
                    if (marker.type !== "HQ") {
                      return prevMarkers.filter((_: any, i: any) => i !== index);
                    } else {
                      return prevMarkers;
                    }
                  });
                }}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>
    </>
  );
}

export default React.memo(Map);
