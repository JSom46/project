import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Label,
  Text,
  TextInput,
  Modal,
  Alert,
  Pressable,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  AddingIcon,
  ButtonView,
  Colors,
  StyledButton,
  StyledInputLabel,
  ButtonText,
  StyledButtonCategory,
  stylesButton,
  StyledContainer,
  InnerContainerOne,
  ExtraView,
  Line,
} from "../../components/styles";
import {
  ButtonViewMap,
  StyledContainerMap,
} from "../../components/Map/mapStyles";
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import MapPicker from "./MapPicker";
import FilterContext from "../../components/Map/FilterContext";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import Slider from "@react-native-community/slider";
import SplashScreen from "../SplashScreen";
const { brand, darkLight, black, primary } = Colors;

function createTypes(name, coats, colors, breeds) {
  return { name, coats, colors, breeds };
}

const Filter = ({ navigation, route }) => {
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");
  const [coats, setCoats] = useState([]);
  const [types, setTypes] = useState();
  const [coatsList, setCoatsList] = useState([]);
  const [colorsList, setColorsList] = useState([]);
  const [breedsList, setBreedsList] = useState([]);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);

  const [filterData, setfilterData] = useContext(FilterContext);
  const [data, setData] = useState({
    category: -1,
    type: "",
    coat: "",
    color: "",
    breed: "",
    lat: "",
    lng: "",
    rad: parseInt(30),
  });

  const [isLoading, setLoading] = useState(true);

  useEffect(
    () => {
      const changeFilter = () => {
        if (lat != null) {
          handleUpdate("lat", lat);
          handleUpdate("lng", lng);
        }
      };
      changeFilter();
      console.log;
    },
    [lng, lat],
    [data]
  );

  const handleTypeChange = (value) => {
    handleUpdate("type", value);
    const choice = types.filter((item) => {
      return item.name == value;
    });
    setCoatsList(choice[0].coats);
    setColorsList(choice[0].colors);
    setBreedsList(choice[0].breeds);
  };
  const handleCoatChange = (event) => {
    if (event != null) {
      handleUpdate("coat", event);
    } else handleUpdate("coat", "");
  };
  const handleColorChange = (event) => {
    if (event != null) {
      handleUpdate("color", event);
    } else handleUpdate("color", "");
  };
  const handleBreedChange = (event) => {
    if (event != null) {
      handleUpdate("breed", event);
    } else handleUpdate("breed", "");
  };

  const handleUpdate = (name, values) => {
    setData((prevState) => ({
      ...prevState,
      [name]: values,
    }));
  };

  const onSubmit = () => {
    if (data.type != "") {
      handleUpdateFilterData("type", data.type);
    }
    if (data.coat != "") {
      handleUpdateFilterData("coat", data.coat);
    }
    if (data.breed != "") {
      handleUpdateFilterData("breed", data.breed);
    }
    if (data.color != "") {
      handleUpdateFilterData("color", data.color);
    }
    if (data.lat != "") {
      handleUpdateFilterData("lat", data.lat);
    }
    if (data.lng != "") {
      handleUpdateFilterData("lng", data.lng);
    }
    if (data.category != -1) {
      handleUpdateFilterData("category", data.category);
    }
    if (slider != 30) {
      handleUpdateFilterData("rad", slider);
    }
    navigation.goBack();
  };

  const handleCallback = (childData, childData1) => {
    setLat(childData);
    setLng(childData1);
  };

  const handleUpdateFilterData = (name, values) => {
    setfilterData((prevState) => ({
      ...prevState,
      [name]: values,
    }));
  };

  const handleTypeChangePost = (array, value) => {
    const choice = array.filter((item) => {
      return item.name == value;
    });

    setCoatsList(choice[0].coats);
    setColorsList(choice[0].colors);
    setBreedsList(choice[0].breeds);
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
    setData(FilterContext);
    saveChanges();
    setSlider(filterData.rad);
    fetchTypes()
      .then((rows) => {
        setTypes(rows);
        if (filterData.type != "") {
          handleTypeChangePost(rows, filterData.type);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const saveChanges = () => {
    handleUpdate("category", filterData.category);
    handleUpdate("type", filterData.type);
    handleUpdate("coat", filterData.coat);
    handleUpdate("color", filterData.color);
    handleUpdate("breed", filterData.breed);
    handleUpdate("lat", filterData.lat);
    handleUpdate("lng", filterData.lng);
    handleUpdate("rad", filterData.rad);
  };

  const onClear = () => {
    handleUpdate("category", -1);
    handleUpdate("type", "");
    handleUpdate("coat", "");
    handleUpdate("color", "");
    handleUpdate("breed", "");
    handleUpdate("lat", "");
    handleUpdate("lng", "");
    handleUpdate("rad", 30);
    handleUpdateFilterData("category", -1);
    handleUpdateFilterData("type", "");
    handleUpdateFilterData("coat", "");
    handleUpdateFilterData("color", "");
    handleUpdateFilterData("breed", "");
    handleUpdateFilterData("lat", "");
    handleUpdateFilterData("lng", "");
    handleUpdateFilterData("rad", 30);
    setSlider(30);
  };

  const [slider, setSlider] = useState(30);

  const [visibleButton, setVisibleButton] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <StyledContainer>
          <InnerContainerOne>
            {/* <StyledInputLabel filter={true}>{"Tytul"}</StyledInputLabel> */}

            {/* <TextInput style={styles.input} onChangeText={setTitle} value={title} /> */}
            <StyledInputLabel filter={true}>
              {"Rodzaj zgłoszenia"}
            </StyledInputLabel>
            <ButtonView>
              <StyledButtonCategory
                isPress={data.category == 0 ? true : false}
                onPress={() => {
                  handleUpdate("category", 0);
                  setVisibleButton(!visibleButton);
                }}
              >
                <ButtonText isCategory={true}>Zaginione</ButtonText>
              </StyledButtonCategory>
              <StyledButtonCategory
                isPress={data.category == 1 ? true : false}
                onPress={() => {
                  handleUpdate("category", 1);
                  setVisibleButton(!visibleButton);
                }}
              >
                <ButtonText isCategory={true}>Znalezione</ButtonText>
              </StyledButtonCategory>
            </ButtonView>
            <Line />
            <StyledInputLabel filter={true}>{"Typ"}</StyledInputLabel>
            <Picker
              style={{ height: 50, width: 350 }}
              selectedValue={data.type}
              onValueChange={(itemValue) => {
                if (itemValue != null) {
                  handleTypeChange(itemValue);
                }
              }}
            >
              {data.type != "" ? null : (
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
            <Line />
            <StyledInputLabel filter={true}>{"Szczegóły:"}</StyledInputLabel>
            <Picker
              style={{ height: 50, width: 350 }}
              onValueChange={(itemValue) => handleCoatChange(itemValue)}
              selectedValue={data.coat == "" ? filterData.coat : data.coat}
              enabled={coatsList.length > 0 ? true : false}
            >
              {data.coat != "" ? null : (
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
            <Picker
              style={{ height: 50, width: 350 }}
              onValueChange={(itemValue) => handleColorChange(itemValue)}
              selectedValue={data.color == "" ? filterData.color : data.color}
              enabled={colorsList.length > 0 ? true : false}
            >
              {data.color != "" ? null : (
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

            <Picker
              style={{ height: 50, width: 350 }}
              onValueChange={(itemValue) => handleBreedChange(itemValue)}
              selectedValue={data.breed == "" ? filterData.breed : data.breed}
              enabled={breedsList.length > 0 ? true : false}
            >
              {data.breed != "" ? null : (
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
            <Line />
            <StyledInputLabel filter={true}>
              {"Wyszukaj po lokacji:"}
            </StyledInputLabel>
            {
              <MapPicker
                parentCallback={handleCallback}
                mapFilter={true}
                range={slider}
                lat={data.lat == "" ? null : data.lat}
                lng={data.lng == "" ? null : data.lng}
              />
            }
            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={200}
              value={data.rad}
              step={1}
              maximumTrackTintColor="#000000"
              onValueChange={(value) => {
                setSlider(value);
              }}
            />
            <Text>{slider}km</Text>
            <Line />
            <ButtonView>
              <StyledButton filter={true} onPress={onSubmit}>
                <ButtonText filter={true}>POKAŻ WYNIKI</ButtonText>
              </StyledButton>
            </ButtonView>
            <ButtonView>
              <StyledButton filter={true} onPress={onClear}>
                <ButtonText filter={true}>WYCZYSC</ButtonText>
              </StyledButton>
            </ButtonView>
            <ExtraView />
          </InnerContainerOne>
          <ExtraView />
        </StyledContainer>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    width: 200,
    borderWidth: 1,
    padding: 10,
  },
});

export default Filter;
