import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  MarkerF,
  useJsApiLoader,
  InfoBoxF,
} from "@react-google-maps/api";
import { Rating } from "react-simple-star-rating";

const containerStyle = {
  width: "100%",
  height: "1000px",
};

const center = {
  lat: 33.59252307158103,
  lng: 130.40803361407887,
};

const defaultAddValue = {
  latLng: {},
  placeId: "",
  name: "",
  photos: [],
  stayTime: "",
};

const defaultValidation = {
  title: false,
  country: false,
  days: false,
};

export const GoogleMapFirst = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    libraries: ["places"],
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
  });

  const [map, setMap] = React.useState(null);
  const [search, setSearch] = useState("");
  const [infoBox, setInfoBox] = useState({});
  const [saveType, setSaveType] = useState("");
  const [plannerSetting, setPlannerSetting] = useState({
    title: "",
    country: "",
    days: 0,
  });
  const [validation, setValidation] = useState(defaultValidation);
  const [isStart, setIsStart] = useState(false);
  const [plannerValue, setPlannerValue] = useState([]);

  console.log(map);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onClickGetGeocode = (e) => {
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: e.latLng }, (geo, s) => {
      if (s === "OK") {
        /*setClickMarker(
          geo.map((item) => {
            return {
              latLng: item.geometry.location,
              placeId: item.place_id,
            };
          })
        );*/

        const placesService = new window.google.maps.places.PlacesService(map);

        placesService.getDetails(
          {
            placeId: geo[0].place_id,
            fields: ["name", "rating", "photo"],
          },
          (es, st) => {
            setInfoBox({ ...es, latLng: e.latLng, placeId: geo[0].place_id });
            setSaveType("");
            map.panTo(e.latLng);
          }
        );
      }
    });
  };

  const onClickSearch = (item) => {
    const placesService = new window.google.maps.places.PlacesService(map);

    map.panTo(item.latLng);
    placesService.getDetails(
      {
        placeId: item.placeId,
        fields: ["name", "rating", "photo"],
      },
      (e, s) => {
        setInfoBox({ ...e, ...item });
      }
    );
  };

  const onSettingChange = (e) => {
    setPlannerSetting({
      ...plannerSetting,
      [e.target.name]:
        e.target.name === "days" ? Number(e.target.value) : e.target.value,
    });
  };

  console.log(plannerValue);

  return (
    <div style={{ overflowX: "hidden" }}>
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={onClickGetGeocode}
          options={{
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
          }}
          clickableIcons={false}
        >
          {infoBox.latLng && (
            <MarkerF
              position={infoBox.latLng}
              icon={{
                url: process.env.PUBLIC_URL + "/mapmarker.png",
                size: 0.1,
              }}
            />
          )}
          >
        </GoogleMap>
      )}
      <div
        style={{
          zIndex: 100,
          position: "absolute",
          top: 0,
          left: 0,
          width: "30%",
          maxHeight: "100%",
          backgroundColor: "white",
          display: "block",
        }}
      >
        <div
          style={{
            height: "25px",
            justifyContent: "center",
            margin: "10px 10px 10px 10px",
            width: "100%",
          }}
        >
          <input
            style={{ width: "150px", height: "20px" }}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <button style={{ width: "50px", height: "25px", marginLeft: "10px" }}>
            검색
          </button>
          <button
            style={{ float: "right", marginRight: "20px" }}
            onClick={() => {
              setInfoBox({});
            }}
          >
            X
          </button>
        </div>
        {infoBox.name && (
          <>
            <div
              style={{
                margin: "10px",
                border: "1px solid black",
              }}
            >
              <div>
                {infoBox.photos && (
                  <img
                    src={infoBox.photos[0].getUrl()}
                    style={{ maxWidth: "100%", maxHeight: "200px" }}
                  />
                )}
              </div>
              <div>{infoBox.name && infoBox.name}</div>
              <div>
                {infoBox.rating && <Rating initialValue={infoBox.rating} />}
              </div>
            </div>
            <div
              style={{
                marginLeft: "10px",
                border: "1px solid red",
              }}
            >
              <label></label>
              <select
                style={{ width: "150px" }}
                value={saveType}
                onChange={(e) => {
                  setSaveType(e.target.value);
                }}
              >
                <option value={""}>선택해주세요.</option>
                <option value={"MAIN"}>메인 장소</option>
                <option value={"SUB"}>서브 장소</option>
              </select>
              <button onClick={() => {}} style={{ marginLeft: "10px" }}>
                등록
              </button>
            </div>
          </>
        )}
      </div>
      <div
        style={{
          zIndex: 150,
          position: "absolute",
          left: "70%",
          top: 0,
          height: "650px",
          width: "30%",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "20%",
            backgroundColor: "white",
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <label>제목</label>
            <input
              placeholder={"제목을 입력해 주세요"}
              style={{
                marginLeft: "10px",
                border: "1px solid " + (validation.title ? "red" : "black"),
              }}
              value={plannerSetting.title}
              name={"title"}
              onChange={onSettingChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <label>국가</label>
            <input
              placeholder={"국가를 입력해 주세요"}
              style={{
                marginLeft: "10px",
                border: "1px solid " + (validation.country ? "red" : "black"),
              }}
              name={"country"}
              value={plannerSetting.country}
              onChange={onSettingChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <label>기간</label>
            <input
              placeholder={"기간을 입력해 주세요"}
              style={{
                marginLeft: "10px",
                border: "1px solid " + (validation.days ? "red" : "black"),
              }}
              name={"days"}
              value={plannerSetting.days === 0 ? "" : plannerSetting.days}
              onChange={onSettingChange}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "10px",
            }}
          >
            <button
              onClick={() => {
                const valid = {
                  title: !Boolean(plannerSetting.title),
                  country: !Boolean(plannerSetting.country),
                  days: plannerSetting.days < 1,
                };

                setValidation(valid);

                if (!Object.values(valid).includes(true)) {
                  if (!isStart) {
                    setPlannerValue(
                      Array(plannerSetting.days)
                        .fill()
                        .map((item, index) => {
                          return {
                            startTime: "",
                            day: index + 1,
                            planner: [defaultAddValue],
                            navigation: [],
                          };
                        })
                    );
                    setIsStart(true);
                  }
                }
              }}
            >
              시작
            </button>
          </div>
        </div>
        {isStart && (
          <>
            <div
              style={{
                width: "100%",
                height: "10%",
                borderTop: "2px solid black",
                backgroundColor: "white",
              }}
            ></div>
            <div
              style={{
                width: "100%",
                height: "50%",
                backgroundColor: "white",
                borderTop: "2px solid black",
                overflowY: "scroll",
              }}
            ></div>
            <div
              style={{
                width: "100%",
                height: "10%",
                backgroundColor: "white",
                border: "1px solid black",
                alignItems: "center",
                display: "inline-flex",
                justifyContent: "center",
              }}
            >
              <button style={{ width: "80px" }}>목록 삭제</button>
              <button style={{ width: "80px", marginLeft: "10px" }}>
                등록
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
