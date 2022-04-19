import styled from "styled-components";
import { StyleSheet, StatusBar } from "react-native";
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
  blue: "#B0E0E6",
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
  blue,
} = Colors;
export const StyledContainer = styled.ScrollView`
  flex: 1;
  padding: 15px;
  padding-bottom: 20px;
  padding-right: 20px;
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
  align-items: stretch;
`;

export const InnerContainerOne = styled.View`
  flex: 1;
  width: 100%;
  align-items: stretch;
`;

export const ImageOne = styled.Image`
  width: 100px;
  height: 100px;
  margin: 2px;
`;

export const InnerContainerImage = styled.View`
  width: 90%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  align-items: center;
  justify-content: center;
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
  ${(props) =>
    props.filter == true &&
    `
    font-weight: bold;
    font-size: 15px;
`}
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
  ${(props) =>
    props.mapPicker == true &&
    `
  right: 15px;
  top: 14px;
  position: absolute;
  z-index: 1;
`}
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
  ${(props) =>
    props.filter == true &&
    `
    padding: 0px;
  height: 40px;
  width: 350px;
  background-color: ${brand};
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
  border-radius: 10px;
  border-width: 1px;
  border-color: ${black};
  ${(props) =>
    props.isPress == true &&
    `
    font-size: 18px;
    background-color: ${blue};
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
  color: ${black};
  font-size: 18px;
  `}

  ${(props) =>
    props.filter == true &&
    `
  color: ${primary};
  font-size: 16px;
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

export const stylesHome = StyleSheet.create({
  dashboard: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    textAlign: "center",
    color: "black",
    marginBottom: 4,
  },
});

export const stylesMap = StyleSheet.create({
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

export const stylesMyProfileContainer = {
  flex: 1,
  justifyContent: "space-around",
  alignItems: "center",
  flexDirection: "column",
};

export const stylesMyProfileButton = {
  backgroundColor: "white",
  alignItems: "center",
  justifyContent: "center",
  padding: 5,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "black",
};

export const stylesMyProfileTextInput = {
  backgroundColor: "lightgray",
  marginBottom: 5,
  padding: 15,
  fontSize: 16,
};

export const announcementAddButton = {
  backgroundColor: "white",
  alignItems: "center",
  justifyContent: "center",
  padding: 5,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: "black",
  marginHorizontal: 20,
  marginVertical: 5,
};

export const categoryButton = {
  padding: 1,
  backgroundColor: "#ffffff",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 15,
  marginVertical: 5,
  height: 60,
  width: 160,
  borderWidth: 1,
  borderColor: "black",
};

export const pickerStyle = {
  height: 50,
  width: "100%",
  backgroundColor: "#E5E7EB",
  marginVertical: 5,
};

export const stylesAnnouncements = StyleSheet.create({
  listContainer: {
    flex: 1,
    //marginTop: StatusBar.currentHeight || 0,
  },

  announcementListItem: {
    backgroundColor: "white",
    padding: 4,
    paddingVertical: 8,
    marginVertical: 1,
    marginHorizontal: 8,
    borderBottomWidth: 1,
    borderRightWidth: 2,
    borderColor: "lightgray",
    flex: 1,
    flexDirection: "row",
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

  announcementDescriptionContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 10,
  },

  announcementDescriptionText: {
    fontSize: 16,
  },

  announcementTitle: {
    fontSize: 32,
    textAlign: "center",
    color: "black",
  },

  announcementPhoto: {
    width: 300,
    height: 300,
    //resizeMode: "stretch",

    //alignSelf: 'center',
    //marginVertical: 8,
  },
});
