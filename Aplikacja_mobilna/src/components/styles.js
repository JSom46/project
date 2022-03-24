import styled from "styled-components";
import { StyleSheet, StatusBar } from "react-native"
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
//cp;prs
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
export const StyledContainer = styled.View`
  flex: 1;
  padding: 25px;
  padding-top: ${StatusBarHeight + 40}px;
  background-color: ${primary};

  ${(props) =>
    props.announce == true &&
    `
    padding: 30px;
    background-color: ${add};
    margin-top: 20px;
    height: 0px;
    width: 400px;
    align-items: center;
  `}

  ${(props) =>
    props.small_bar == true &&
    `
    flex: 1;
  padding: 25px;
  padding-top:  150px;
    background-color: ${green};
    height: 0px;
    width: 150px;
    align-items: center;
  `}
`;
export const InnerContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const InnerContainerOne = styled.View`
  flex: 1;
  width: 100%;
  align-items: stretch;
`;

export const ImageOne = styled.Image`
  width: 100px;
  height: 100px;
`;

export const PageTitle = styled.Text`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  color: ${brand};
  padding: 10px;
`;
export const SubTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 20px;
  letter-spacing: 1px;
  font-weight: bold;
  color: ${tetriary};
`;

export const StyledFormArea = styled.View`
  width: 90%;
`;

export const StyledTextInput = styled.TextInput`
  background-color: ${secondary};
  padding: 15px;
  padding-left: 55px;
  padding-right: 55px;
  border-radius: 5px;
  font-size: 16px;
  height: 60px;
  margin-bottom: 10px;
  color: ${tetriary};
`;

export const StyledTextInputAdd = styled.TextInput`
  background-color: ${secondary};
  font-size: 16px;
  height: 60px;
  padding-left: 10px;
  margin-bottom: 10px;
  color: ${tetriary};
  ${(props) =>
    props.isDescription == true &&
    `
    textAlign: left;
  height: 160px;
  editable,
  `}
`;

export const StyledInputLabel = styled.Text`
  color: ${tetriary};
  font-size: 13px;
  text-align: left;
`;

export const LeftIcon = styled.View`
  left: 15px;
  top: 34px;
  position: absolute;
  z-index: 1;
`;

export const RightIcon = styled.TouchableOpacity`
  right: 15px;
  top: 34px;
  position: absolute;
  z-index: 1;
`;

export const AddingIcon = styled.TouchableOpacity`
  right: 15px;
  top: 34px;
  position: absolute;
  z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${brand};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;

  ${(props) =>
    props.welcome == true &&
    `

    margin-top: 50px;
     margin-right: 100px;
    height: 70px;
    width: 300px;
  `}

  ${(props) =>
    props.google == true &&
    `
  height: 50px;
  width: 150px;
  background-color: ${green};
  flex-direction: row;
  justify-content: space-evenly;
  `}

  ${(props) =>
    props.facebook == true &&
    `
  height: 50px;
  width: 150px;
  display: flex;
  background-color: ${facebook};
  flex-direction: row;
  justify-content: space-evenly;
  `}

  ${(props) =>
    props.isPhoto == true &&
    `
    padding-right: 35px;
  height: 100px;
  width: 100px;
  display: flex;
  background-color: ${secondary};
  flex-direction: row;
  justify-content: space-evenly;
  `}
`;

export const StyledButtonCategory = styled.TouchableOpacity`
  padding: 15px;
  background-color: ${primary};
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  margin-vertical: 5px;
  height: 60px;
  width: 140px;
  border-radius: 10;
  border-width: 1;
  border-color: ${black};
  ${(props) =>
    props.isPressed == 0 &&
    `
    background-color: ${black};
    `}
`;

export const ButtonText = styled.Text`
  color: ${primary};
  font-size: 26px;

  ${(props) =>
    props.welcome == true &&
    `
    font-size: 6px;
  `}
  ${(props) =>
    props.google == true &&
    `
  font-size: 16px;

  `}

  ${(props) =>
    props.facebook == true &&
    `
    font-size: 16px;
 
  `}
  ${(props) =>
    props.isCategory == true &&
    `
  color: ${black};
  font-size: 16px;
  `}
  ${(props) =>
    props.isPhoto == true &&
    `
  color: ${primary};
  font-size: 18px;
  `}
`;

export const MsgBox = styled.Text`
  text-align: center;
  font-size: 13px;
  color: ${(props) => (props.type == "TRUE" ? green : red)};
`;

export const Line = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${darkLight};
  margin-vertical: 10px;
`;

export const ExtraView = styled.View`
  justify-content: center;
  flex-direction: row;
  align-items: center;
  padding: 10px;
`;

export const ButtonView = styled.View`
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
`;

export const ExtraText = styled.Text`
  justify-content: center;
  align-content: center;
  color: ${tetriary};
  font-size: 15px;
`;

export const TextLink = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${brand}
    font-size: 15px;
    text-align: center;
`;

export const WelcomeContainer = styled(InnerContainer)`
  padding: 25px;
  padding-top: 10px;
  justify-content: center;
`;





//---------
const stylesAuth = StyleSheet.create({
  back: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      
  },

  card: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'skyblue',
      padding: 20,
      width: '80%',
      borderRadius: 10,
      //borderColor: 'black',
      //borderWidth: 1,
      elevation: 6,
  },

  input: {
      fontSize: 16,
      backgroundColor: 'white',
      margin: 5,
      width: '100%',
  },

  button: {
      backgroundColor: '#2196F3',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
      borderRadius: 5,
  },

  buttonText: {
      color: 'white',
      fontWeight: '500',
      fontSize: 16,
      textTransform: "uppercase",
  },
});

const stylesHome = StyleSheet.create({
  dashboard: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },

  title: {
      fontSize: 32,
      textAlign: "center",
      color: "black",
      marginBottom: 4,
  },
});

const stylesMap = StyleSheet.create({
  callout: {
      width: 150,
      height: 150,
      paddingBottom: 10,
  },

  calloutTitle: {
      fontSize: 16,
      color: "black",
      textAlign: "center",
      marginBottom: 4,
  },
});

const stylesAnnouncements = StyleSheet.create({
  listContainer: {
      flex: 1,
      //marginTop: StatusBar.currentHeight || 0,
  },

  announcementListItem: {
      backgroundColor: 'white',
      padding: 4,
      paddingVertical: 8,
      marginVertical: 1,
      marginHorizontal: 8,
      borderBottomWidth: 1,
      borderRightWidth: 2,
      borderColor: 'lightgray',
      flex: 1,
      flexDirection: "row"
  },

  announcementListItemTitle: {
      fontSize: 24,
  },

  announcementListItemPhoto: {
      width: 100,
      height: 100,
      marginRight: 8,
  },

  announcementContainer: {
      flex: 1,
  },

  announcementTitle: {
      fontSize: 32,
      textAlign: "center",
      color: "black",
  },

  announcementPhoto: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      marginVertical: 8,
  }
});


export {stylesAuth, stylesHome, stylesAnnouncements, stylesMap};