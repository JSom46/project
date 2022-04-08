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

const OPTIONS = [
  { text: "bardzo maly", rad: 15 },
  { text: "maly", rad: 55 },
  { text: "sredni", rad: 150 },
  { text: "duzy", rad: 305 },
  { text: "bardzo duzy", rad: 1500 },
];

const DistanceFilter = (props) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("Wybierz ");

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  return (
    <Menu
      transparent={true}
      visible={visible}
      value={value}
      anchor={<Text onPress={showMenu}>{value}</Text>}
      onRequestClose={hideMenu}
    >
      {OPTIONS.map((text, index) => (
        <MenuItem
          key={index}
          onPress={() => {
            setVisible(false);
            setValue(text.text);
            props.parentCallback(text.rad);
          }}
        >
          {text.text}
        </MenuItem>
      ))}
    </Menu>
  );
};

export { DistanceFilter };
