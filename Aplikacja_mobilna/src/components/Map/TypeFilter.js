import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { Component, useState, useEffect } from "react";
import { Menu, MenuItem, MenuDivider } from "react-native-material-menu";
import { Button } from "react-native-paper";

const OPTIONS = [
  //   { text: "brak", id: 0, bool: false },
  { text: "Psy", id: 1, bool: false },
  { text: "Koty", id: 2, bool: false },
  { text: "Króliki", id: 3, bool: false },
  { text: "Gryzonie", id: 4, bool: false },
  { text: "Konie", id: 5, bool: false },
  { text: "Ptaki", id: 6, bool: false },
  { text: "Gady i płazy", id: 7, bool: false },
  { text: "Zwierzęta hodowlane", id: 8, bool: false },
  { text: "Inny", id: 9, bool: false },
];

const TypeFilter = (props) => {
  const [visible, setVisible] = useState(false);
  const [addvalue, setAddBValue] = useState(false);
  const [value, setValue] = useState("brak");

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  return (
    <Menu
      transparent={true}
      visible={visible}
      value={value}
      addvalue={addvalue}
      anchor={<Text onPress={showMenu}>{value}</Text>}
      onRequestClose={hideMenu}
    >
      {OPTIONS.map((text, index) =>
        !text.bool ? (
          <MenuItem
            key={index}
            style={styles.container}
            onPress={() => {
              text.bool = true;
              setValue(text.text);
            }}
          >
            {text.text}
          </MenuItem>
        ) : (
          <MenuItem
            key={index}
            style={styles.containerB}
            onPress={() => {
              text.bool = false;
              setValue(text.text);
            }}
          >
            {text.text}
          </MenuItem>
        )
      )}
      <Button
        onPress={(e) => {
          setVisible(false);
          {
            let napis = "";
            OPTIONS.map((text, index) => {
              if (text.bool) {
                napis = napis + text.text + ",";
              }
            });
            props.parentCallback(napis);
            //console.log("Napis:  " + napis);
          }
          //props.parentCallback(text.text);
        }}
      >
        OK
      </Button>
    </Menu>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  containerB: {
    backgroundColor: "#00ffff",
  },
});

export { TypeFilter };
