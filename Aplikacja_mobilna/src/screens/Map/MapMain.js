import React, { useState, useEffect } from "react";
import { StyleSheet, View, Label, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import {
  AddingIcon,
  ButtonView,
  Colors,
  StyledButton,
} from "../../components/styles";

import {
  ButtonViewMap,
  StyledContainerMap,
} from "../../components/Map/mapStyles";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import { DistanceFilter } from "./../../components/Map/DistanceFilter";
import { TypeFilter } from "../../components/Map/TypeFilter";
import { CategoryFilter } from "../../components/Map/CategoryFilter";

import {Svg, Image as ImageSvg} from 'react-native-svg';
import { stylesMap } from "../../components/styles";

const { brand, darkLight, black, primary } = Colors;

const MapMain = ({navigation}) => {
  const [mapRegion, setRegion] = useState(null);
  const [hasLocationPermissions, setLocationPermission] = useState(false);
  //dane do filtrowania
  const [data, setData] = useState({
    page: "",
    num: "",
    category: "",
    type: "",
    coat: "",
    color: "",
    breed: "",
    lat: "",
    lng: "",
    rad: 60,
  });
  //dane z ogloszen
  const [tableData = [], setTableData] = useState();
  const [status, setStatus] = useState();

  useEffect(() => {
    const getLocationAsync = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setStatus(status);
      if ("granted" !== status) {
        setLocation("Permission to access location was denied");
      } else {
        setLocationPermission(true);
        let {
          coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({});
        handleUpdate("lat", latitude);
        handleUpdate("lng", longitude);
        // Center the map on the location we just fetched.
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };
    getLocationAsync();
  }, [status]);

  useEffect(() => {
    const fetchData = async (data) => {
      setTableData();
      if (data.type == undefined) handleUpdate("type", "");
      if (data.category == undefined) handleUpdate("type", "");
      let url =
        "http://" +
        serwer +
        "/anons/list?" +
        "lat=" +
        data.lat +
        "&lng=" +
        data.lng +
        "&rad=" +
        data.rad +
        "&type=" +
        data.type +
        (data.category == "0"
          ? "&category=" + data.category
          : data.category == "1"
          ? "&category=" + data.category
          : " ");
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const json = await response.json();
        const tabData = [];
        json.list.forEach((element) => {
          const rows = [];
          rows.push(
            element.id,
            element.title,
            element.category,
            element.description,
            element.type,
            element.lat,
            element.lng,
            element.image,
          );
          tabData.push(rows);
        });
        setTableData(tabData);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData(data);
  }, [data]);

  const handleCallback = (childData) => {
    handleUpdate("rad", childData);
  };
  const handleCallbackType = (childData) => {
    handleUpdate("type", childData);
  };
  const handleCallbackCategory = (childData) => {
    handleUpdate("category", childData);
  };
  const handleUpdate = (name, values) => {
    setData((prevState) => ({
      ...prevState,
      [name]: values,
    }));
  };

  return (
    <View style={styles.body}>
      <MapView style={styles.map} initialRegion={mapRegion}>
        {/* Do Poprawy - Wyswietlanie pinezek */}
        {/* {tableData.map((marker, index) => (
          <Marker
            draggable
            key={index}
            coordinate={{ latitude: marker[5], longitude: marker[6] }}
            pinColor={marker[2] == 1 ? "green" : "red"}
          />
        ))} */}

        {tableData.map(marker => (
                    <Marker
                    key={marker[0]}
                    coordinate={{ latitude: marker[5], longitude: marker[6] }}
                    pinColor={marker[2] == 1 ? "#0F0" : "#F00"}
                    >
                        <Callout
                            style={stylesMap.callout}
                            onPress={() => navigation.navigate('Ogloszenie', {announcement: marker})}
                        >
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={stylesMap.calloutTitle}>{marker[1]}</Text>
                                <Svg width={120} height={120}>
                                    <ImageSvg
                                        width={'100%'} 
                                        height={'100%'}
                                        preserveAspectRatio="xMidYMid slice"
                                        href={{ uri: 'http://' + serwer + '/anons/photo?name=' + marker[7]}}
                                    />
                                </Svg>
                            </View>
                        </Callout>
                    </Marker>
                ))}
      </MapView>
      <AddingIcon>
        <Octicons name={"ellipsis"} size={30} color={black} />
      </AddingIcon>
      <StyledContainerMap>
        <ButtonViewMap>
          <Text>Rozmiar:</Text>
          <DistanceFilter parentCallback={handleCallback} />
        </ButtonViewMap>
        <ButtonViewMap>
          <Text>Typ:</Text>
          <TypeFilter parentCallback={handleCallbackType} />
        </ButtonViewMap>
        <ButtonViewMap>
          <Text>Kategoria:</Text>
          <CategoryFilter parentCallback={handleCallbackCategory} />
        </ButtonViewMap>
      </StyledContainerMap>
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
