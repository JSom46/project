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
const { brand, darkLight, black, primary } = Colors;

function createTypes(name, coats, colors, breeds) {
  return { name, coats, colors, breeds };
}

// function createFilters() {
//   return {
//     category: -1,
//     anonTitle: "",
//     type: "",
//     coat: "",
//     color: "",
//     breed: "",
//     location: null,
//     rad: -1,
//   };
// }

const Filter = ({ navigation, route }) => {
  const [color, setColor] = useState("");
  const [breed, setBreed] = useState("");
  const [coats, setCoats] = useState([]);
  const [colors, setColors] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [types, setTypes] = useState();
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [slider, setSlider] = useState(30);

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
  useEffect(
    () => {
      const changeFilter = () => {
        handleUpdate("lat", lat);
        handleUpdate("lng", lng);
      };
      changeFilter();
    },
    [lng, lat],
    [data]
  );
  // const handleTypeChange = (event) => {
  //   if (event != null) {
  //     handleUpdate("type", event);
  //     const choice = types.filter((type) => {
  //       return type.name === event;
  //     });
  //     handleUpdate("coat", "");
  //     handleUpdate("color", "");
  //     handleUpdate("breed", "");
  //     setCoats(choice[0].coats);
  //     setColors(choice[0].colors);
  //     setBreeds(choice[0].breeds);
  //   } else {
  //     handleUpdate("type", "");
  //     handleUpdate("coat", "");
  //     handleUpdate("color", "");
  //     handleUpdate("breed", "");
  //   }
  // };
  const handleTypeChange = (value) => {
    handleUpdate("type", value);
    //console.log(value);
    //console.log(typesList);
    //console.log(typesList[0].name);
    const choice = types.filter((item) => {
      return item.name == value;
    });
    //console.log(choice);
    //console.log(choice[0].coats);
    handleUpdate("coat", "");
    handleUpdate("color", "");
    handleUpdate("breed", "");
    setCoats(choice[0].coats);
    setColors(choice[0].colors);
    setBreeds(choice[0].breeds);
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
    console.log(data);
    setfilterData(data);
    navigation.goBack();
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
  }, []);

  const handleCallback = (childData, childData1) => {
    setLat(childData);
    setLng(childData1);
  };
  const handleRadChange = (event) => {
    handleUpdate("rad", event);
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
    console.log(data);
    console.log(filterData);
  };

  useEffect(() => {
    const saveChanges = () => {
      handleUpdate("category", filterData.category);
      handleUpdate("type", filterData.type);
      handleUpdate("coat", filterData.coat);
      handleUpdate("color", filterData.color);
      handleUpdate("breed", filterData.breed);
      handleUpdate("lat", filterData.lat);
      handleUpdate("lng", filterData.lng);
      handleUpdate("rad", filterData.rad);
      console.log("data");
      console.log(data);
    };
    saveChanges();
  }, [filterData]);

  const [visibleButton, setVisibleButton] = useState(false);

  return (
    <StyledContainer>
      <InnerContainerOne>
        <StyledInputLabel filter={true}>{"Rodzaj zgłoszenia"}</StyledInputLabel>
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
          <Picker.Item
            label="wybierz typ"
            value={null}
            color="#9EA0A4"
          ></Picker.Item>
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
          enabled={coats.length > 0 ? true : false}
          selectedValue={data.coat}
        >
          <Picker.Item
            label="Owłosienie"
            value={null}
            color="#9EA0A4"
          ></Picker.Item>
          {coats &&
            coats.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
        </Picker>
        <Picker
          style={{ height: 50, width: 350 }}
          onValueChange={(itemValue) => handleColorChange(itemValue)}
          enabled={colors.length > 0 ? true : false}
          selectedValue={data.color}
        >
          <Picker.Item
            label="Umaszczenie"
            value={null}
            color="#9EA0A4"
          ></Picker.Item>
          {colors &&
            colors.map((item) => (
              <Picker.Item key={item} label={item} value={item} />
            ))}
        </Picker>

        <Picker
          style={{ height: 50, width: 350 }}
          onValueChange={(itemValue) => handleBreedChange(itemValue)}
          enabled={breeds.length > 0 ? true : false}
          selectedValue={data.breed}
        >
          <Picker.Item label="Rasa" value={null} color="#9EA0A4"></Picker.Item>
          {breeds &&
            breeds.map((item) => (
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
            range={data.rad >= 0 ? data.rad : null}
            lat={data.lat == "" ? null : data.lat}
          />
        }
        <Slider
          style={{ width: 300, height: 40 }}
          minimumValue={0}
          maximumValue={1000}
          value={data.rad >= 0 ? data.rad : 30}
          step={1}
          maximumTrackTintColor="#000000"
          onValueChange={(value) => {
            handleUpdate("rad", value);
          }}
        />
        <Text>{data.rad >= 0 ? data.rad : 30}km</Text>
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
  );
};

export default Filter;
