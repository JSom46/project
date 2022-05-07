import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  StyledButton,
  StyledInputLabel,
  ButtonText,
  ExtraView,
  ImageOne,
  InnerContainerOne,
  MsgBox,
  StyledButtonPhoto,
} from "../../components/styles";
import MapPicker from "../Map/MapPicker";

import { Entypo } from "@expo/vector-icons";

const AddNotification = ({ navigation, route }) => {
  const [image, setImage2] = useState([]);
  const [anons_id] = useState(route.params.anons_id);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [messageType, setMessageType] = useState();
  const [message, setMessage] = useState();

  async function postNotification() {
    const formData = new FormData();
    formData.append("anon_id", anons_id);
    image.map((item, key) => formData.append("picture", item));
    formData.append("lat", lat);
    formData.append("lng", lng);
    //console.log(formData);
    try {
      const response = await fetch(
        "http://" + serwer + "/anons/notifications",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  const validationCheck = () => {
    setMessage();
    if (lat == undefined) {
      setMessageType(false);
      setMessage("Nie wybrano punktu na mapie");
    } else if (!image.length) {
      Alert.alert(
        "Nie wybrano zdjęcia",
        "Czy chcesz dodać zgłoszenie mimo to?",
        [
          {
            text: "Tak",
            onPress: () => {
              handleSubmit();
            },
            style: "destructive",
          },
          {
            text: "Nie",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    } else handleSubmit();
  };

  const handleSubmit = async () => {
    const response = await postNotification();
    if (response.status == 200) {
      //  console.log("pomyslnie dodano zgloszenie");
      alert("Pomyślnie dodano ogłoszenie.");

      navigation.goBack();
    } else {
      alert("Nie udało się dodać ogłoszenia.");
      //    console.log("Nie udało się dodać ogłoszenia.");
    }
  };

  const handleCallback = (childData, childData2) => {
    setLat(childData);
    setLng(childData2);
  };

  const handleCallbackPhoto = (childData) => {
    setImage2(childData);
    //  console.log(childData);
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainerOne>
        <ExtraView />
        <ExtraView />
        <ExtraView />
        <ExtraView />
        <StyledInputLabel filter={true}>
          {"Gdzie widziałeś to zwierze?*:"}
        </StyledInputLabel>
        {<MapPicker parentCallback={handleCallback} range={null} />}
        <MsgBox type={messageType}>{message}</MsgBox>

        <StyledInputLabel filter={true}>{"Dodaj zdjęcie:"}</StyledInputLabel>
        {image.length ? (
          <StyledButtonPhoto
            onPress={() => {
              navigation.navigate("ImageBrowser", {
                onGoBack: handleCallbackPhoto,
                count: 1,
              });
            }}
          >
            {image.map((item, key) => (
              <ImageOne
                key={key}
                isNotification={true}
                source={{ uri: item.uri }}
              />
            ))}
          </StyledButtonPhoto>
        ) : (
          <StyledButton
            isNotification={true}
            onPress={() => {
              navigation.navigate("ImageBrowser", {
                onGoBack: handleCallbackPhoto,
                count: 1,
              });
            }}
          >
            <ButtonText isPhoto={true}>
              <Entypo name={"camera"} size={50} />
            </ButtonText>
          </StyledButton>
        )}
        <StyledButton
          announce={true}
          style={{ marginBottom: 50 }}
          onPress={validationCheck}
        >
          <ButtonText>Wyślij </ButtonText>
        </StyledButton>
        <ExtraView />
      </InnerContainerOne>
    </StyledContainer>
  );
};

export default AddNotification;
