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
  { text: "Brak", category: "" },
  { text: "Zaginione", category: 0 },
  { text: "Znalezione", category: 1 },
];

const CategoryFilter = (props) => {
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
            props.parentCallback(text.category);
          }}
        >
          {text.text}
        </MenuItem>
      ))}
    </Menu>
  );
};

export { CategoryFilter };
