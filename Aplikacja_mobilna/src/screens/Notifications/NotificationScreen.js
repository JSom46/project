import React, { useState, useEffect, useRef } from "react";
import MapView from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import { AddingIcon, ExtraView } from "../../components/styles";
import ImageViewer from "react-native-image-zoom-viewer";
import { StyledInputLabel } from "./../../components/styles";

const NotificationsScreen = (props) => {
  //const location = props.location;
  const [lat, setLat] = useState(props.lat);
  const [lng, setLng] = useState(props.lng);
  const [isLoading, setLoading] = useState(false);
  const [image, setImage] = useState(props.image);

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const images = [
    {
      url: "http://" + serwer + "/anons/photo?name=" + image,
    },
  ];
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <View style={{ flex: 1 }}>
          <StyledInputLabel announce={true}>Lokalizacja</StyledInputLabel>
          <View style={styles.container2}>
            <MapView
              style={styles.map2}
              initialRegion={{
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {lat == null ? null : lng == null ? null : lng ==
                undefined ? null : (
                <MapView.Marker
                  coordinate={{ latitude: lat, longitude: lng }}
                  pinColor={"#00C"}
                  size={30}
                ></MapView.Marker>
              )}
            </MapView>
          </View>
        </View>
      )}
      <ExtraView></ExtraView>
      {image == "" ? (
        <StyledInputLabel announce={true}>
          Brak załączonego obrazka
        </StyledInputLabel>
      ) : (
        <View style={{ flex: 1 }}>
          <StyledInputLabel announce={true}>Zdjęcie</StyledInputLabel>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TouchableOpacity onPress={toggleModal}>
              <Image
                source={{
                  uri: "http://" + serwer + "/anons/photo?name=" + image,
                }}
                style={{ width: 200, height: 200 }}
              />
            </TouchableOpacity>

            <Modal
              animationType={"slide"}
              visible={isModalVisible}
              transparent={true}
              onRequestClose={() => {
                setModalVisible(false);
              }}
            >
              <TouchableOpacity
                style={styles.container}
                activeOpacity={1}
                onPressOut={() => {
                  setModalVisible(false);
                }}
              >
                <TouchableWithoutFeedback>
                  <ImageViewer imageUrls={images} />
                </TouchableWithoutFeedback>
              </TouchableOpacity>
            </Modal>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  container2: {
    marginTop: 5,
    borderWidth: 4,
    borderRadius: 4,
    width: 365,
    height: 265,
  },
  map2: {
    flex: 1,
  },
});

export default NotificationsScreen;
