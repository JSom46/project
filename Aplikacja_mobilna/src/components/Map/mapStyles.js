import styled from "styled-components";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import Constants from "expo-constants";

const StatusBarHeight = Constants.statusBarHeight;
export const Colors = {
  primary: "#ffffff",
  secondary: "#E5E7EB",
  tetriary: "#1F2937",
  darkLight: "#9CA3AF",
  brand: "#6D28D9",
  green: "#10B981",
  red: "#EF4444",
  black: "#000000",
  facebook: "#3b5998",
  add: "#AFCF5F",
};

const {
  primary,
  secondary,
  tetriary,
  darkLight,
  brand,
  green,
  red,
  facebook,
  add,
  black,
} = Colors;

export const StyledContainerMap = styled.View`
  flex: 1;
  padding: 20px;
  height: 500px;
  width: 200px;
  margin-top: 600px;
  margin-left: 200px;
  background-color: ${primary};
`;

export const ImageOne = styled.Image`
  width: 100px;
  height: 100px;
`;

export const ButtonViewMap = styled.View`
  justify-content: space-evenly;
  flex-direction: row;
  align-items: flex-start;
`;
