import React, { useState, useEffect, useContext, useRef } from "react";
import MapView, { Marker, Circle } from "react-native-maps";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import FilterContext from "../../components/Map/FilterContext";
import { MaterialIcons } from "@expo/vector-icons";
import { AddingIcon } from "../../components/styles";
import UserLocationContext from "../../components/Context/UserLocationContext";

const MapPicker = (props) => {
  //const location = props.location;
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [userLocation, setUserLocation] = useContext(UserLocationContext);
  const [filterData, setfilterData] = useContext(FilterContext);
  const [rad, setRad] = useState(0);
  const mapRef = useRef();

  useEffect(() => {
    function handleLocationChange() {
      if (filterData.lat != "") {
        setLat(filterData.lat);
        setLng(filterData.lng);
      }
    }

    handleLocationChange();
  }, [filterData.lat, filterData.lng]);

  useEffect(() => {
    if (props.lat != null) {
      setLat(props.lat);
      setLng(props.lng);
      console.log(lat);
    }
  }, [props.lat, props.lng]);

  useEffect(() => {
    if (props.range != null) {
      setRad(parseInt(props.range) * 1000);
    }
  }, [props.range]);

  const animateToRegion = () => {
    mapRef.current.animateToRegion(userLocation, 2000);
  };

  return (
    <View
      style={props.mapFilter == true ? styles.container : styles.container2}
    >
      <MapView
        ref={mapRef}
        style={props.mapFilter == true ? styles.map : styles.map2}
        onPress={(e) => {
          if (
            e.nativeEvent.coordinate.latitude != undefined &&
            e.nativeEvent.coordinate.latitude != undefined
          ) {
            setLat(e.nativeEvent.coordinate.latitude);
            setLng(e.nativeEvent.coordinate.longitude);
          }
        }}
      >
        {lat == null
          ? null
          : lng == null
          ? null
          : lat == undefined
          ? null
          : props.parentCallback(lat, lng)}
        {lat == null ? null : lng == null ? null : lng == undefined ? null : (
          <MapView.Marker
            coordinate={{ latitude: lat, longitude: lng }}
            pinColor={"#000000"}
          />
        )}
        {lat == null ? null : lat == undefined ? null : lng ==
          null ? null : lng == undefined ? null : rad == null ? null : isNaN(
            rad
          ) == true ? null : (
          <Circle
            center={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            radius={rad}
            strokeColor="rgba(158, 158, 255, 1.0)"
            fillColor="rgba(0, 0, 255, 0.3)"
          />
        )}
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
  container: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 1,
    width: 305,
    height: 255,
  },
  container2: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 3,
    width: 340,
    height: 255,
  },
  map: {
    position: "absolute",
    width: 300,
    height: 250,
    borderWidth: 2,
    borderRadius: 1,
  },
  map2: {
    flex: 1,
    // width: 320,
    // height: 250,
    borderWidth: 15,
    borderRadius: 15,
  },
});

export default MapPicker;
