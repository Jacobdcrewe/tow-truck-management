import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Switcher from "../common/Switcher";
import AccidentAddModal from "./Accidents/AccidentAddModal";
import DispatchAddModal from "./Dispatchers/DispatchAddModal";

function Map(props: any) {
  const containerStyle = {
    width: "800px",
    height: "400px",
  };

  const [center, setCenter] = useState({
    type: "HQ",
    name: "HQ",
    lat: 43.657626544332,
    lng: -79.37881708145142,
  });
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: props.apiKey,
    libraries: ["geometry", "drawing"],
  });

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
  const [showAccidentModal, setShowAccidentModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [accidentLocation, setAccidentLocation] = useState({} as any);
  const [dispatchLocation, setDispatchLocation] = useState({} as any);
  const [dispatchers, setDispatchers] = useState([] as any);
  const [accidents, setAccidents] = useState([] as any);

  const handleMapClick = (event: any) => {
    const newMarker = {
      type: markerType.toUpperCase(),
      name: markerType.toUpperCase() + " " + (markers.length + 1),
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    if (markerType.toUpperCase() === "ACCIDENT") {
      if (
        markers.filter((marker: any) => marker.type === "STATION").length > 0
      ) {
        setShowAccidentModal(true);
        setAccidentLocation(newMarker);
      } else {
        alert("Please add a station first");
      }
    } else {
      setShowDispatchModal(true);
      setDispatchLocation(newMarker);
    }
  };
  useEffect(() => {
    if (isLoaded) {
      setDispatchers([center, ...props.dispatchers]);
      setAccidents([...props.accidents]);
    }
  }, [center, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setMarkers([...dispatchers, ...accidents]);
      props.fetchDispatchers();
    }
  }, [dispatchers, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      setMarkers([...dispatchers, ...accidents]);
      props.fetchAccidents();
    }
  }, [accidents, isLoaded]);
  return (
    <>
      {showAccidentModal && (
        <AccidentAddModal
          accidentLocation={accidentLocation}
          apiKey={props.apiKey}
          modal={showAccidentModal}
          dispatchers={dispatchers.filter((dispatch: any) => (dispatch.type !== "ACCIDENT" && dispatch.type !== "HQ"))}
          setModal={setShowAccidentModal}
          onSave={() => {
            setAccidents((prevMarkers: any) => [
              ...prevMarkers,
              accidentLocation,
            ]);
            setShowAccidentModal(false);
          }}
        />
      )}
      {showDispatchModal && (
        <DispatchAddModal
          dispatchLocation={dispatchLocation}
          apiKey={props.apiKey}
          modal={showDispatchModal}
          setModal={setShowDispatchModal}
          onSave={() => {
            setDispatchers((prevMarkers: any) => [
              ...prevMarkers,
              dispatchLocation,
            ]);
            setShowDispatchModal(false);
          }}
        />
      )}
      <div className="w-full h-full flex items-center justify-center relative">
        <Switcher
          className="absolute left-0 bottom-0 m-2 z-10"
          setMarkerType={setMarkerType}
        />
        {isLoaded && (
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
              />
            ))}
          </GoogleMap>
        )}
      </div>
    </>
  );
}

export default React.memo(Map);
