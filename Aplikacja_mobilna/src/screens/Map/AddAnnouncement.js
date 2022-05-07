import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapPicker from "./MapPicker";
import { Alert } from "react-native";
import React, { useState, useEffect } from "react";
//icon
//import * as RNFS from "react-native-fs";
import * as FileSystem from "expo-file-system";
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
  pickerStyle,
  categoryButton,
  InnerContainerImage,
  stylesAnnouncements,
} from "../../components/styles";
import { StatusBar } from "expo-status-bar";

import axios from "axios";
import { Button } from "react-native-paper";
import { Entypo } from "@expo/vector-icons";
import * as Yup from "yup";

const { brand, darkLight, black, primary, facebook } = Colors;

function createTypes(name, coats, colors, breeds) {
  return { name, coats, colors, breeds };
}

const AddAnnouncement = ({ navigation, route }) => {
  const [category, setCategory] = useState();
  const [type, setType] = useState("");
  const [coat, setCoat] = useState("");
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");
  const [image, setImage] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState();
  const [coatsList, setCoatsList] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [types, setTypes] = useState();
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const [messageType1, setMessageType1] = useState();
  const [message1, setMessage1] = useState();

  const [alertData, setAlertData] = useState({
    open: false,
    variant: "filled",
    severity: "error",
    text: "",
  });

  async function postAnnoucement(e) {
    const formData = new FormData();
    formData.append("title", e.title);
    formData.append("category", e.category);
    formData.append("description", e.description);
    formData.append("type", e.type);
    formData.append("coat", e.coat);
    formData.append("color", e.color);
    formData.append("breed", e.breed);
    image.map((item, key) => formData.append("pictures", item));
    formData.append("lat", lat);
    formData.append("lng", lng);
    console.log(formData);
    try {
      const response = await fetch("http://" + serwer + "/anons/", {
        method: "POST",
        credentials: "include",
        body: formData,
        headers: formData.getHeadres,
      });
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleSubmitt = async (e) => {
    console.log(e);
    if (checkFormLat(e)) {
      if (checkFormType(e)) {
        const response = await postAnnoucement(e);
        console.log(response.status);
        if (response.status == 200) {
          alert("Pomyślnie dodano ogłoszenie.");
          navigation.goBack();
        } else {
          alert("Nie udało się dodać ogłoszenia.");
        }
      }
    }
  };

  const handleTypeChange = (value) => {
    setType(value);
    const choice = types.filter((item) => {
      return item.name == value;
    });
    setCoat("");
    setColor("");
    setBreed("");
    setCoatsList(choice[0].coats);
    setColorsList(choice[0].colors);
    setBreedsList(choice[0].breeds);
  };

  useEffect(() => {
    const fetchTypes = async () => {
      let url = "http://" + serwer + "/anons/types";
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const json = await response.json();
        const rows = [];
        json.forEach((element) => {
          rows.push(
            createTypes(
              element.name,
              element.coats,
              element.colors,
              element.breeds
            )
          );
        });

        setTypes(rows);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchTypes();
    if (route.params.photos != "") {
      setImage(route.params.photos);
    }
    setMessage("");
    setMessage1("");
  }, []);

  const handleCallback = (childData, childData2) => {
    setLat(childData);
    setLng(childData2);
  };

  const handleCallbackPhoto = (childData) => {
    setImage(childData);
  };

  const checkFormType = (e) => {
    console.log(e.type);
    if (e.type == "") {
      setMessageType1(false);
      setMessage1("Nie wybrano typu zwierzaka");
      console.log("Nie wybrano typu zwierzaka");
      return false;
    }
    return true;
  };

  const checkFormLat = (e) => {
    if (lat == "") {
      setMessageType(false);
      setMessage("Nie wybrano punktu na mapie");
      return false;
    }
    return true;
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Tytuł jest wymagany")
      .min(3, "Tytuł powinien miec conajmniej 3 znaki"),
    category: Yup.string().required("Wybierz kategorię ogłoszenia"),
    description: Yup.string().required("Opis jest wymagany"),
  });

  return (
    <StyledContainer>
      <StatusBar style="dark" />

      <InnerContainerOne>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            title: "",
            category: "",
            description: "",
            lat: "",
            lng: "",
            selectedCategoryButton: null,
            type: "",
            coat: "",
            color: "",
            breed: "",
          }}
          onSubmit={(values) => {
            handleSubmitt(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isValid,
          }) => (
            <StyledFormArea>
              <MyTextInput
                label="Tytuł*"
                placeholder="Wpisz"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("title")}
                onBlur={handleBlur("title")}
                value={values.title}
                // keyboardType="email.address"
              />
              {errors.title && touched.title && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.title}
                </Text>
              )}
              <MyTextInput
                label="Opis*"
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
              {errors.description && touched.description && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.description}
                </Text>
              )}
              <StyledInputLabel announce={true}>Typ*</StyledInputLabel>
              <Picker
                style={pickerStyle}
                selectedValue={type}
                onValueChange={(itemValue) => {
                  handleTypeChange(itemValue);
                  values.type = itemValue;
                  setMessage1("");
                }}
              >
                {type != "" ? null : (
                  <Picker.Item
                    label="Wybierz typ"
                    value={null}
                    color="#9EA0A4"
                  ></Picker.Item>
                )}
                {types &&
                  types.map((item) => (
                    <Picker.Item
                      key={item.name}
                      label={item.name}
                      value={item.name}
                    />
                  ))}
              </Picker>
              <MsgBox type={messageType1}>{message1}</MsgBox>

              <StyledInputLabel announce={true}>Owłosienie</StyledInputLabel>

              <Picker
                style={pickerStyle}
                onValueChange={(itemValue) => {
                  setCoat(itemValue);
                  values.coat = itemValue;
                }}
                selectedValue={coat}
                enabled={coatsList.length > 0 ? true : false}
              >
                {coat != "" ? null : (
                  <Picker.Item
                    label="Owłosienie"
                    value={null}
                    color="#9EA0A4"
                  ></Picker.Item>
                )}

                {coatsList.map((item) => (
                  <Picker.Item key={item} label={item} value={item} />
                ))}
              </Picker>

              <StyledInputLabel announce={true}>Umaszczenie</StyledInputLabel>
              <Picker
                style={pickerStyle}
                selectedValue={color}
                onValueChange={(itemValue) => {
                  setColor(itemValue);
                  values.color = itemValue;
                }}
                enabled={colorsList.length > 0 ? true : false}
              >
                {color != "" ? null : (
                  <Picker.Item
                    label="Umaszczenie"
                    value={null}
                    color="#9EA0A4"
                  ></Picker.Item>
                )}
                {colorsList &&
                  colorsList.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
              </Picker>
              <StyledInputLabel announce={true}>Rasa</StyledInputLabel>
              <Picker
                style={pickerStyle}
                onValueChange={(itemValue) => {
                  values.breed = itemValue;
                  setBreed(itemValue);
                }}
                enabled={breedsList.length > 0 ? true : false}
                selectedValue={breed}
              >
                {breed != "" ? null : (
                  <Picker.Item
                    label="Umaszczenie"
                    value={null}
                    color="#9EA0A4"
                  ></Picker.Item>
                )}
                {breedsList &&
                  breedsList.map((item) => (
                    <Picker.Item key={item} label={item} value={item} />
                  ))}
              </Picker>
              <StyledInputLabel announce={true}>
                {"Kategoria*"}
              </StyledInputLabel>
              <ButtonView>
                <TouchableOpacity
                  style={[
                    categoryButton,
                    { backgroundColor: category == 0 ? "#0898de" : "#ffffff" },
                  ]}
                  onPress={() => {
                    values.category = 0;
                    setCategory(0);
                  }}
                >
                  <Text style={{ fontSize: 18, color: "black" }}>
                    Zaginione
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    categoryButton,
                    { backgroundColor: category == 1 ? "#0898DE" : "#ffffff" },
                  ]}
                  onPress={() => {
                    values.category = 1;
                    setCategory(1);
                  }}
                >
                  <Text style={{ fontSize: 18, color: "black" }}>
                    Znalezione
                  </Text>
                </TouchableOpacity>
              </ButtonView>
              {errors.category && touched.category && (
                <Text style={{ fontSize: 10, color: "red" }}>
                  {errors.category}
                </Text>
              )}
              <StyledInputLabel announce={true}>
                {"Wskaż lokalizacje zgłoszenia*"}
              </StyledInputLabel>
              {
                <MapPicker
                  parentCallback={handleCallback}
                  range={null}
                  lat={null}
                  lng={null}
                />
              }

              <MsgBox type={messageType}>{message}</MsgBox>
              <StyledInputLabel announce={true}>
                {"Dodaj zdjęcia:"}
              </StyledInputLabel>
              <InnerContainerImage>
                <StyledButton
                  isEditAnnouncement={true}
                  onPress={() => {
                    navigation.navigate("ImageBrowser", {
                      onGoBack: handleCallbackPhoto,
                      count: 8,
                    });
                  }}
                >
                  <ButtonText isPhoto={true}>
                    <Entypo name={"camera"} size={50} />
                  </ButtonText>
                </StyledButton>

                {image == undefined
                  ? null
                  : image.map((item, key) => (
                      <ImageOne key={key} source={{ uri: item.uri }} />
                    ))}
              </InnerContainerImage>
              <StyledButton
                announce={true}
                onPress={handleSubmit}
                style={{ marginBottom: 50 }}
              >
                <ButtonText>Dodaj</ButtonText>
              </StyledButton>
            </StyledFormArea>
          )}
        </Formik>
        {/* <Alert
          variant={alertData.variant}
          severity={alertData.severity}
          sx={{ mb: 2 }}
        >
          {alertData.text}
        </Alert> */}
      </InnerContainerOne>
    </StyledContainer>
  );
};

const MyTextInput = ({ label, ...props }) => {
  return (
    <View>
      <StyledInputLabel announce={true}>{label}</StyledInputLabel>
      <StyledTextInputAdd {...props} />
    </View>
  );
};

export default AddAnnouncement;
