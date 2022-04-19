import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
  pickerStyle,
  categoryButton,
} from "../../components/styles";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { Button } from "react-native-paper";

//import { AssetsSelector } from "expo-images-picker";

//import { ImageBrowser } from "expo-image-picker-multiple";

const { brand, darkLight, black, primary, facebook } = Colors;

function createTypes(name, coats, colors, breeds) {
  return { name, coats, colors, breeds };
}

const AddAnnouncement = ({ navigation }) => {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [category, setCategory] = useState();
  const [pictures, setPictures] = useState();
  const [type, setType] = useState("");
  const [coat, setCoat] = useState("");
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");
  const [picturesPreview, setPicturesPreview] = useState();
  const [image, setImage] = useState(null);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [typesList = [], setTypesList] = useState();
  const [coatsList, setCoatsList] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [selectedType, setSelectedType] = useState(-1);
  const [selectedColor, setSelectedColor] = useState();
  const [selectedCoat, setSelectedCoat] = useState();
  const [selectedBreed, setSelectedBreed] = useState();

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
    formData.append("coat", coat);
    formData.append("color", color);
    formData.append("breed", breed);
    formData.append("picture", image);
    formData.append("lat", Math.random()); //Dane z mapy
    formData.append("lng", Math.random()); //Dane z mapy

    console.log("FormData: ", formData);

    try {
      const response = await fetch("http://" + serwer + "/anons/", {
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
    if (response.status == 200) {
      alert("Pomyślnie dodano ogłoszenie.");
      navigation.goBack();
    } else {
      alert("Nie udało się dodać ogłoszenia.");
    }
  };

  const handleTypeChange = (value) => {
    setType(value);
    //console.log(value);
    //console.log(typesList);
    //console.log(typesList[0].name);
    const choice = typesList.filter((item) => {
      return item.name == value;
    });
    //console.log(choice);
    //console.log(choice[0].coats);
    setCoat("");
    setColor("");
    setBreed("");
    setCoatsList(choice[0].coats);
    setColorsList(choice[0].colors);
    setBreedsList(choice[0].breeds);
  };

  React.useEffect(() => {
    const fetchTypes = async () => {
      const url = "http://" + serwer + "/anons/types";

      axios
        .get(url)
        .then((response) => {
          const result = response.data;
          //console.log(response);
          if (response.status == "200") {
            //console.log(result);
            //const json = response.json();
            const tempTypes = [];

            result.forEach((element) => {
              tempTypes.push(
                createTypes(
                  element.name,
                  element.coats,
                  element.colors,
                  element.breeds
                )
              );
            });

            //console.log(tempTypes);

            setTypesList(tempTypes);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchTypes();
  }, []);

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainerOne>
        <SubTitle>Dodaj ogłoszenie</SubTitle>
        <ButtonView>
          <StyledButton isPhoto={true} onPress={openImagePickerAsync}>
            <ButtonText isPhoto={true}>Wybierz{"\n"}zdjęcia</ButtonText>
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
            coat: "",
            color: "",
            breed: "",
          }}
          onSubmit={(values) => {
            values.lat = 50;
            values.lng = 50;
            setTitle(values.title);
            setCategory(values.category);
            setDescription(values.description);
            setType(values.type);
            setCoat(values.coat);
            setBreed(values.breed);
            setColor(values.color);
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

              <StyledInputLabel>Typ</StyledInputLabel>
              <Picker
                style={pickerStyle}
                onValueChange={(itemValue) => {
                  handleChange("type");
                  values.type = itemValue;
                  //alert(values.type);
                  handleTypeChange(itemValue);
                  setSelectedType(itemValue);
                }}
                selectedValue={selectedType}
                prompt="Typ"
              >
                {typesList.map((item) => {
                  return (
                    <Picker.Item
                      label={item.name.toString()}
                      value={item.name.toString()}
                      key={item.name.toString()}
                    />
                  );
                })}
              </Picker>

              <StyledInputLabel>Owłosienie</StyledInputLabel>
              <Picker
                style={pickerStyle}
                onValueChange={(itemValue) => {
                  handleChange("coat");
                  values.coat = itemValue;
                  setSelectedCoat(itemValue);
                }}
                selectedValue={selectedCoat}
                prompt="Owłosienie"
                enabled={coatsList.length > 1 ? true : false}
              >
                {coatsList.length > 1 ? (
                  coatsList.map((item) => {
                    //console.log(item);
                    return <Picker.Item label={item} value={item} key={item} />;
                  })
                ) : (
                  <Picker.Item label={"Wybierz owłosienie"} value={0} key={0} />
                )}
              </Picker>

              <StyledInputLabel>Umaszczenie</StyledInputLabel>
              <Picker
                style={pickerStyle}
                onValueChange={(itemValue) => {
                  handleChange("color");
                  values.color = itemValue;
                  setSelectedColor(itemValue);
                }}
                selectedValue={selectedColor}
                prompt="Umaszczenie"
                enabled={colorsList.length > 1 ? true : false}
              >
                {colorsList.length > 1 ? (
                  colorsList.map((item) => {
                    //console.log(item);
                    return <Picker.Item label={item} value={item} key={item} />;
                  })
                ) : (
                  <Picker.Item
                    label={"Wybierz umaszczenie"}
                    value={0}
                    key={0}
                  />
                )}
              </Picker>

              <StyledInputLabel>Rasa</StyledInputLabel>
              <Picker
                style={pickerStyle}
                onValueChange={(itemValue) => {
                  handleChange("breed");
                  values.breed = itemValue;
                  setSelectedBreed(itemValue);
                }}
                selectedValue={selectedBreed}
                prompt="Rasa"
                enabled={breedsList.length > 1 ? true : false}
              >
                {breedsList.length > 1 ? (
                  breedsList.map((item) => {
                    //console.log(item);
                    return <Picker.Item label={item} value={item} key={item} />;
                  })
                ) : (
                  <Picker.Item label={"Wybierz rasę"} value={0} key={0} />
                )}
              </Picker>

              <StyledInputLabel>{"Kategoria"}</StyledInputLabel>
              <ButtonView>
                {/* <StyledButtonCategory onPress={() => setCategory(0)}>
                  <ButtonText isCategory={true}>Zaginione</ButtonText>
                </StyledButtonCategory>
                <StyledButtonCategory onPress={() => setCategory(1)}>
                  <ButtonText isCategory={true}>Znalezione</ButtonText>
                </StyledButtonCategory> */}
                <TouchableOpacity
                  style={[
                    categoryButton,
                    { backgroundColor: category == 0 ? "#E5E7EB" : "#ffffff" },
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
                    { backgroundColor: category == 1 ? "#E5E7EB" : "#ffffff" },
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

              <StyledButton onPress={handleSubmit} style={{ marginBottom: 50 }}>
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
