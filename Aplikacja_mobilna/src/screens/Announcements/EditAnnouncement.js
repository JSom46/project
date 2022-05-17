import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MapPicker from "./../Map/MapPicker";
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
  StyledButtonPhoto,
} from "./../../components/styles";
import { StatusBar } from "expo-status-bar";
import { Entypo } from "@expo/vector-icons";
import * as Yup from "yup";
import SplashScreen from "../SplashScreen";

const { brand, darkLight, black, primary, facebook } = Colors;

// function createTypes(name, coats, colors, breeds) {
//   return { name, coats, colors, breeds };
// }

function createTypes(name, coats, colors, breeds) {
  if (coats.length > 0) coats.unshift("");
  if (colors.length > 0) colors.unshift("");
  if (breeds.length > 0) breeds.unshift("");
  return { name, coats, colors, breeds };
}

const EditAnnouncement = ({ navigation, route }) => {
  const [id] = useState(route.params.params.id);
  const [title, setTitle] = useState(route.params.params.title);
  const [description, setDescription] = useState(
    route.params.params.description
  );
  const [category, setCategory] = useState(route.params.params.category);
  const [type, setType] = useState(route.params.params.type);
  const [coat, setCoat] = useState(route.params.params.coat);
  const [color, setColor] = useState(route.params.params.color);
  const [breed, setBreed] = useState(route.params.params.breed);
  const [image, setImage] = useState([]);
  const [lat, setLat] = useState(route.params.params.lat);
  const [lng, setLng] = useState(route.params.params.lng);
  const [image1, setImage1] = useState(route.params.params.images);
  const [coatsList, setCoatsList] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [types, setTypes] = useState();
  const [isLoading, setLoading] = useState(true);

  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  const [alertData, setAlertData] = useState({
    open: false,
    variant: "filled",
    severity: "error",
    text: "",
  });

  async function editAnnoucement() {
    const formData = new FormData();
    formData.append("id", id);
    image.map((item, key) => formData.append("pictures", item));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("lat", lat);
    formData.append("lng", lng);

    formData.append("type", type);
    formData.append("coat", coat);
    formData.append("color", color);
    formData.append("breed", breed);

    console.log(formData);

    try {
      const response = await fetch("http://" + serwer + "/anons/", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleSubmit = async (e) => {
    const response = await editAnnoucement();
    if (response.status == 200) {
      alert("Pomyślnie edytowano ogłoszenie.");
      navigation.goBack();
    } else {
      alert("Nie udało się edytować ogłoszenia.");
    }
  };

  const handleTypeChange = (array, value) => {
    const choice = array.filter((item) => {
      return item.name == value;
    });

    setCoatsList(choice[0].coats);
    setColorsList(choice[0].colors);
    setBreedsList(choice[0].breeds);
  };
  const handleType = (value) => {
    setType(value);
    setCoat("");
    setBreed("");
    setColor("");
    // console.log(types);
    const choice = types.filter((item) => {
      return item.name == value;
    });

    setCoatsList(choice[0].coats);
    setColorsList(choice[0].colors);
    setBreedsList(choice[0].breeds);
  };

  const handleCallback = (childData, childData2) => {
    setLat(childData);
    setLng(childData2);
  };

  const handleCallbackPhoto = (childData) => {
    setImage(childData);
    setImage1([]);
  };

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
      return rows;
    } catch (error) {
      console.log("error", error);
      return true;
    }
  };

  useEffect(() => {
    fetchTypes()
      .then((rows) => {
        setTypes(rows);
        handleTypeChange(rows, type);
      })
      .finally(() => {
        setLoading(false);
      });
    if (route.params.photos != "") {
      setImage(route.params.photos);
    }
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required("Tytuł jest wymagany")
      .min(3, "Tytuł powinien miec conajmniej 3 znaki"),
    category: Yup.string().required("Wybierz kategorię ogłoszenia"),
    description: Yup.string().required("Opis jest wymagany"),
    type: Yup.string().required("Wybierz typ zwierzęcia"),
  });

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <StyledContainer>
          <ExtraView></ExtraView>
          <StatusBar style="dark" />

          <InnerContainerOne>
            <SubTitle>Edytuj ogłoszenie</SubTitle>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                title: title,
                category: category,
                description: description,
                lat: lat,
                lng: lng,
                selectedCategoryButton: null,
                type: type,
                coat: coat,
                color: color,
                breed: breed,
              }}
              onSubmit={(values) => {
                setTitle(values.title);
                setCategory(values.category);
                setDescription(values.description);
                setType(values.type);
                setCoat(values.coat);
                setBreed(values.breed);
                setColor(values.color);
                handleSubmit();
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
                      handleType(itemValue);
                      values.type = itemValue;
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

                  <StyledInputLabel announce={true}>
                    Owłosienie
                  </StyledInputLabel>

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
                    {coatsList &&
                      coatsList.map((item) => (
                        <Picker.Item key={item} label={item} value={item} />
                      ))}
                  </Picker>

                  <StyledInputLabel announce={true}>
                    Umaszczenie
                  </StyledInputLabel>
                  <Picker
                    style={pickerStyle}
                    onValueChange={(itemValue) => {
                      setColor(itemValue);
                      values.color = itemValue;
                    }}
                    selectedValue={color}
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
                        label="Rasa"
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
                        {
                          backgroundColor:
                            category == 0 ? "#0898de" : "#ffffff",
                        },
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
                        {
                          backgroundColor:
                            category == 1 ? "#0898DE" : "#ffffff",
                        },
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
                      lat={lat == "" ? null : lat}
                      lng={lng == "" ? null : lng}
                      parentCallback={handleCallback}
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

                    {image1 && image1.length
                      ? image1.map((item, key) => (
                          <ImageOne
                            key={key}
                            source={{
                              uri:
                                "http://" +
                                serwer +
                                "/anons/photo?name=" +
                                item,
                            }}
                          />
                        ))
                      : !(image && image.length)
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
                    <ButtonText>Zapisz zmiany</ButtonText>
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
      )}
    </View>
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

export default EditAnnouncement;
