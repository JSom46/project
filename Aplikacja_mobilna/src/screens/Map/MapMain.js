import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { useFocusEffect, useLinkProps } from "@react-navigation/native";
import MapView from "react-native-map-clustering";
import * as Location from "expo-location";

import { AddingIcon, Colors } from "../../components/styles";

import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import FilterContext from "../../components/Map/FilterContext";
import { Svg, Image as ImageSvg } from "react-native-svg";
import { stylesMap } from "../../components/styles";
import { userDataContext } from "../UserDataContext";
import UserLocationContext from "../../components/Context/UserLocationContext";

const { brand, darkLight, black, primary } = Colors;

const MapMain = ({ navigation, route }) => {
  const [userLocation, setUserLocation] = useContext(UserLocationContext);
  const [hasLocationPermissions, setLocationPermission] = useState(false);
  const testowazmienna = 232323;
  const [markerRefs, setMarkerRefs] = useState([]);
  const [focusRegion, setFocusRegion] = useState(null);
  //const [userData, setUserData] = useState(route.params.userData);
  const { userData, setUserData } = React.useContext(userDataContext);

  //dane z ogloszen
  const [tableData = [], setTableData] = useState();
  const [status, setStatus] = useState();
  const [filterData, setfilterData] = useContext(FilterContext);

  const [mapRegion, setRegion] = useState({
    latitude: 50,
    longitude: 20,
    latitudeDelta: 10.0922,
    longitudeDelta: 10.0421,
  });

  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setStatus(status);
      if ("granted" !== status) {
        setLocation("Permission to access location was denied");
      } else {
        console.log("grand");
        setLocationPermission(true);
        let {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});
        handleUpdate("latitude", latitude);
        handleUpdate("longitude", longitude);
        console.log(userLocation.lat);
        console.log(userLocation.lng);
        // Center the map on the location we just fetched.
        setRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };
    getLocationAsync();
  }, []);

  function createData(id, title, category, description, type, lat, lng, image) {
    return { id, title, category, description, type, lat, lng, image };
  }

  function addParam(arg, params) {
    let str = "";
    if (params === 0) {
      str += "?";
    } else {
      str += "&";
    }
    str += arg;
    return str;
  }

  const fetchData = async () => {
    console.log(filterData);
    setTableData();
    let url = "http://" + serwer + "/anons/list";
    let params = 0;
    if (filterData.category !== -1) {
      url += addParam("category=" + filterData.category, params);
      params++;
    }
    if (filterData.type !== "") {
      url += addParam("type=" + filterData.type, params);
      params++;
    }
    if (filterData.coat !== "") {
      url += addParam("coat=" + filterData.coat, params);
      params++;
    }
    if (filterData.color !== "") {
      url += addParam("color=" + filterData.color, params);
      params++;
    }
    if (filterData.breed !== "") {
      url += addParam("breed=" + filterData.breed, params);
      params++;
    }
    if (filterData.lat !== "") {
      url += addParam("lat=" + filterData.lat.toString(), params);
      params++;
    }
    if (filterData.lng !== "") {
      url += addParam("lng=" + filterData.lng.toString(), params);
      params++;
    }
    if (filterData.rad !== -1 && filterData.rad !== 30) {
      url += addParam("rad=" + filterData.rad, params);
      params++;
    }
    console.log(url);
    try {
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const json = await response.json();
      const tabData = [];
      json.list.forEach((element) => {
        tabData.push(
          createData(
            element.id,
            element.title,
            element.category === 0 ? "Zaginięcie" : "Znalezienie",
            element.description,
            element.type,
            element.lat,
            element.lng,
            element.image
          )
        );
      });
      setTableData(tabData);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(
    () => {
      fetchData();
      console.log("filterData");
      console.log(filterData);
    },
    [filterData],
    []
  );
  const mapRef = useRef();

  const animateToRegion = () => {
    console.log(mapRegion);
    mapRef.current.animateToRegion(mapRegion, 2000);
  };

  useFocusEffect(
    React.useCallback(() => {
      //console.log("WYWOLALO SJE");
      //console.log("useEffect1", route.params);
      //console.log("userData: ", userData);
      if (route.params && route.params.focusCoordinates != null) {
        console.log("sa parametry: ", route.params.focusCoordinates);
        const tempRegion = {
          latitude: route.params.focusCoordinates.lat,
          longitude: route.params.focusCoordinates.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        mapRef.current.animateToRegion(tempRegion, 2000);
        //navigation.setParams({focusCoordinates: null});
        route.params.focusCoordinates = null;
      }
    }, [route.params])
  );

  useFocusEffect(
    React.useCallback(() => {
      //console.log("useEffect2", route.params);
      if (route.params && route.params.refresh) {
        console.log("wywolano odswiezenie mapy");
        fetchData();
        route.params.refresh = false;
      }
    }, [route.params])
  );

  const handleUpdate = (name, values) => {
    setUserLocation((prevState) => ({
      ...prevState,
      [name]: values,
    }));
  };

  return (
    <View style={styles.body}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={mapRegion}
        clusterColor="#0d730d"
      >
        {tableData.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.lat, longitude: marker.lng }}
            pinColor={marker.category == "Znalezienie" ? "#0F0" : "#00F"}
            ref={(ref) => {
              markerRefs[marker.id] = ref;
            }}
            onPress={() => {
              setTimeout(() => {
                markerRefs[marker.id].hideCallout();
                markerRefs[marker.id].showCallout();
              }, 100);
            }}
          >
            <Callout
              style={stylesMap.callout}
              onPress={() =>
                navigation.navigate("Ogloszenie", {
                  announcement: marker,
                  //userData: userData
                })
              }
            >
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={stylesMap.calloutTitle}>{marker.title}</Text>
                <Svg width={120} height={120}>
                  <ImageSvg
                    width={"100%"}
                    height={"100%"}
                    preserveAspectRatio="xMidYMid slice"
                    href={{
                      uri:
                        "http://" +
                        serwer +
                        "/anons/photo?name=" +
                        marker.image,
                    }}
                  />
                </Svg>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <AddingIcon mapPicker={true}>
        <MaterialIcons
          name={"my-location"}
          size={30}
          onPress={animateToRegion}
        />
      </AddingIcon>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MapMain;
