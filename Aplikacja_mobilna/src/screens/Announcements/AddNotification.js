import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, View, Label, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  RightIcon,
  StyledButton,
  StyledInputLabel,
  StyledTextInput,
  Colors,
  LeftIcon,
  ButtonText,
  MsgBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  ButtonView,
  ImageOne,
  InnerContainerOne,
  StyledTextInputAdd,
  StyledButtonCategory,
  InnerContainerImage,
} from "../../components/styles";
import MapPicker from "../Map/MapPicker";
import { set } from "react-native-reanimated";

const AddNotification = ({ navigation, route }) => {
  const [image, setImage] = useState([]);

  const { photos } = route.params;
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [anonsId, setAnonsId] = useState();
  const [pictures, setPictures] = useState(new FormData());

  const handlePictures = () => {
    const formData = new FormData();
    const picturesPreviewArray = [];
    for (let i = 0; i < image.length; i++) {
      picturesPreviewArray.push(image[i].name);
      formData.append("pictures", picturesPreviewArray[i]);
    }
    setPictures(formData);
    console.log(pictures);
  };

  async function postNotification() {
    const formData = new FormData();
    formData.append("anon_id", anonsId);
    formData.append("picture", pictures);
    formData.append("lat", lat);
    formData.append("lng", lng);
    console.log("ten");
    console.log(formData);
    try {
      const response = await fetch(
        "http://" + serwer + "/anons/notifications",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );
      console.log(response);
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
  useEffect(() => {
    for (let [key, value] of Object.entries(route.params)) {
      {
        `${key}` == "anons_id" && `${value}` != ""
          ? setAnonsId(`${value}`)
          : `${key}` == "anons_id" && `${value}` != ""
          ? setImage(`${value}`)
          : setImage(photos);
      }
    }
    console.log(anonsId);
    console.log(image);
    // for (let i = 0; i < image.length; i++) {
    //   console.log(image[i].name);
    // }
    [route.params];
  });

  const handleSubmit = async (e) => {
    handlePictures();
    const response = await postNotification();
    if (response.status == 200) {
      console.log("pomyslnie dodano zgloszenie");
      navigation.goBack();
    } else {
      console.log("Nie udało się dodać ogłoszenia.");
    }
  };

  const handleCallback = (childData, childData2) => {
    setLat(childData);
    setLng(childData2);
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainerOne>
        <ExtraView />
        <ExtraView />
        <ExtraView />
        <ExtraView />
        <ButtonView>
          <StyledButton
            filter={true}
            onPress={() => {
              navigation.navigate("ImageBrowser", { value: "2" });
            }}
          >
            <ButtonText>Dodaj zdjecia</ButtonText>
          </StyledButton>
        </ButtonView>
        <InnerContainerImage>
          {/* {image.length == undefined
            ? null
            : image.map((item, key) => (
                <ImageOne key={key} source={{ uri: item.uri }} />
              ))} */}

          {image.length != 0 &&
            image.map((item, key) => (
              <ImageOne key={key} source={{ uri: item.uri }} />
            ))}
        </InnerContainerImage>
        <StyledInputLabel filter={true}>
          {"Gdzie widziałeś to zwierze?:"}
        </StyledInputLabel>
        {<MapPicker parentCallback={handleCallback} range={null} />}
        <StyledButton filter={true} onPress={handleSubmit}>
          <ButtonText>Dodaj</ButtonText>
        </StyledButton>
        <ExtraView />
      </InnerContainerOne>
    </StyledContainer>
  );
};

export default AddNotification;
