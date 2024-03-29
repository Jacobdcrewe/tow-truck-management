import React, { useContext, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import Switcher from "../common/Switcher";
import AccidentAddModal from "./Accidents/AccidentAddModal";
import DispatchAddModal from "./Dispatchers/DispatchAddModal";
import { UserContext } from "../ContentRouter";

function Map(props: any) {
  const containerStyle = {
    width: "800px",
    height: "400px",
  };

  const [center, setCenter] = useState({
    type: "HQ_EMPLOYEE",
    name: "HQ_EMPLOYEE",
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
    hq: "https://maps.google.com/mapfiles/ms/icons/default.png",
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

  const { accountType } = useContext(UserContext);

  const handleMapClick = (event: any) => {
    props.fetchDispatchers();
    props.fetchAccidents();
    if (accountType !== "HQ_EMPLOYEE") return;
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
      if (accountType !== "HQ_EMPLOYEE") {
        setDispatchers([center])
        setAccidents([...props.accidents])
        return
      };
      setDispatchers([center, ...props.dispatchers]);
      setAccidents([...props.accidents]);
    }
  }, [center, isLoaded, accountType]);

  useEffect(() => {
    if (isLoaded) {
      setMarkers([...dispatchers, ...accidents]);
      if(accountType === "HQ_EMPLOYEE") {
        props.fetchDispatchers();

      }
    }
  }, [dispatchers, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if(accountType === "HQ_EMPLOYEE") {
        props.fetchDispatchers();

      }
      console.log(accountType, dispatchers, accidents)

      setMarkers([center, ...props.dispatchers, ...props.accidents]);
      props.fetchAccidents();
    }
  }, [accidents, isLoaded]);

  return (
    <>

      {showAccidentModal && accountType === "HQ_EMPLOYEE" && ( // Use the useContext hook to access the accountType variable
        <AccidentAddModal
          accidentLocation={accidentLocation}
          apiKey={props.apiKey}
          modal={showAccidentModal}
          dispatchers={props.dispatchers.filter((dispatch: any) => (dispatch.type !== "ACCIDENT" && dispatch.type !== "HQ"))}
          setModal={setShowAccidentModal}
          onSave={async () => {
            await props.fetchAccidents()
            setAccidents((prev: any) => [...prev, accidentLocation]);
            setShowAccidentModal(false);
          }}
        />
      )}
      {showDispatchModal && accountType === "HQ_EMPLOYEE" && (
        <DispatchAddModal
          dispatchLocation={dispatchLocation}
          apiKey={props.apiKey}
          modal={showDispatchModal}
          setModal={setShowDispatchModal}
          onSave={async () => {
            await props.fetchDispatchers()
            setDispatchers((prev: any) => [...prev, dispatchLocation]);

            setShowDispatchModal(false);
          }}
        />
      )}
      <div className="w-full h-full flex items-center justify-center relative">
        {accountType === "HQ_EMPLOYEE" && <Switcher
          className="absolute left-0 bottom-0 m-2 z-10"
          setMarkerType={setMarkerType}
        />}
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={15}
            onClick={handleMapClick}
            options={mapOptions}
          >
            {markers.map((marker: any, index: any) => {
              if (marker) {
                const type = marker && marker.type !== null ? marker.type.toLowerCase() as keyof typeof markerIconURL : "hq";
                return (
                  <Marker
                    key={index}
                    position={{
                      lat: marker.lat, lng: marker.lng
                    }}
                    icon={{
                      url: markerIconURL[type],
                      scaledSize: new window.google.maps.Size(30, 30), // Adjust size if needed
                    }}
                  />);
              }

            }
            )}
          </GoogleMap>
        )}
      </div>
    </>
  );
}

export default React.memo(Map);
