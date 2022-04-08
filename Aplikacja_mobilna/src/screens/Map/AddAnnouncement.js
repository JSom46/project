import { View } from "react-native";

import React, { useState, useEffect } from "react";
//icon

import { Formik } from "formik";
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
} from "../../components/styles";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

//import { AssetsSelector } from "expo-images-picker";

//import { ImageBrowser } from "expo-image-picker-multiple";

const { brand, darkLight, black, primary, facebook } = Colors;

const AddAnnouncement = ({ navigation }) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState("");
  const [pictures, setPictures] = useState();
  const [type, setType] = useState();
  const [picturesPreview, setPicturesPreview] = useState();
  const [image, setImage] = useState(null);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    console.log(pickerResult);
    if (!pickerResult.cancelled) {
      setImage(pickerResult.uri);
      setPictures(pickerResult.uri);
      console.log(pictures.uri);
    }
  };

  const handlePictures = (event) => {
    const formData = new FormData();
    const picturesPreviewArray = [];
    for (let i = 0; i < event.target.files.length; i++) {
      picturesPreviewArray.push(URL.createObjectURL(event.target.files[i]));
      formData.append("pictures", event.target.files[i]);
    }
    setPictures(formData);
    setPicturesPreview(picturesPreviewArray);
    // console.log(picturesPreview);
  };

  const handleAddAnnounce = () => {
    const formData = new FormData();
    //  formData.append("title", credentials.title);
    //  formData.append("category", credentials.category);
    //  formData.append("description", credentials.description);
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("lat", Math.random()); //Dane z mapy
    formData.append("lng", Math.random()); //Dane z mapy
    formData.append("pictures", image);
    // console.log(formData);

    var config = {
      method: "post",
      url: "http://" + serwer + "/anons/",
      data: formData,
      headers: formData.getHeadres,
    };
    axios(config)
      .then((response) => {
        // console.log("dostalem");
        //  console.log(response.data);
      })
      .catch((err) => {
        //  console.log(err.response);
      });
  };

  // handleActiveButton = (id) => {
  //   this.props.selectedtype.bind(this, id);
  //   setState({ activeButton: id });
  // };

  async function postAnnoucement() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("picture", image);
    formData.append("lat", Math.random()); //Dane z mapy
    formData.append("lng", Math.random()); //Dane z mapy

    //console.log(formData);

    try {
      const response = await fetch("http://"+ serwer + "/anons/", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await response;
      // console.log(JSON.stringify(json));
      return json;
    } catch (error) {
      console.log("error", error);
    }
  }
  const handleSubmit = async (e) => {
    const response = await postAnnoucement();
    //console.log(JSON.stringify(response));
    if(response.status == 200){
      alert("Pomyślnie dodano ogłoszenie.")
      navigation.goBack();
    }else{
      alert("Nie udało się dodać ogłoszenia.");
    }
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainerOne>
        <SubTitle>Dodaj ogloszenie</SubTitle>
        <ButtonView>
          <StyledButton isPhoto={true} onPress={openImagePickerAsync}>
            <ButtonText isPhoto={true}>Pick a photo</ButtonText>
            {image && <ImageOne source={{ uri: image }} />}
          </StyledButton>
        </ButtonView>

        {/* <ImageBrowser
          max={4}
          onChange={(num, onSubmit) => {}}
          callback={(callback) => {}}
        /> */}

        {/* <ImageBrowser
          max={4}
          onChange={(num, onSubmit) => {}}
          callback={(callback) => {}}
        /> */}
        <Formik
          initialValues={{
            title: "",
            category: "",
            description: "",
            lat: "",
            lng: "",
            selectedCategoryButton: null,
            type: "",
          }}
          onSubmit={(values) => {
            values.lat = 50;
            values.lng = 50;
            setTitle(values.title);
            setCategory(values.category);
            setDescription(values.description);
            setType(values.type);
            setLat(50);
            setLng(50);
            setPictures("");
            handleSubmit();
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormArea>
              <MyTextInput
                label="Tytuł"
                placeholder="Wpisz"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("titles")}
                value={values.title}
                // keyboardType="email.address"
              />
              <MyTextInput
                label="Opis"
                placeholder="Wpisz"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("description")}
                onBlur={handleBlur("description")}
                value={values.description}
                multiline
                numberOfLines={4}
                isDescription={true}
                // keyboardType="email.address"
              />
              <MyTextInput
                label="Typ"
                placeholder="Wpisz"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("type")}
                onBlur={handleBlur("type")}
                value={values.type}
                // keyboardType="email.address"
              />
              <StyledInputLabel>{"Kategoria"}</StyledInputLabel>
              <ButtonView>
                <StyledButtonCategory onPress={() => (values.category = 0)}>
                  <ButtonText isCategory={true}>Zaginione</ButtonText>
                </StyledButtonCategory>
                <StyledButtonCategory onPress={() => (values.category = 1)}>
                  <ButtonText isCategory={true}>Znalezione</ButtonText>
                </StyledButtonCategory>
              </ButtonView>

              <StyledButton onPress={handleSubmit}>
                <ButtonText>Dodaj</ButtonText>
              </StyledButton>
            </StyledFormArea>
          )}
        </Formik>
      </InnerContainerOne>
    </StyledContainer>
  );
};

const MyTextInput = ({ label, ...props }) => {
  return (
    <View>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInputAdd {...props} />
    </View>
  );
};

export default AddAnnouncement;
