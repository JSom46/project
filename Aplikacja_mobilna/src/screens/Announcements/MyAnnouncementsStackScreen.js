import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { stylesHome, stylesAnnouncements } from "../../components/styles";
import AnnouncementsList from "./AnnouncementsList";
import AnnouncementView from "../AnnouncementView";
import AddAnnouncement from "../Map/AddAnnouncement";
import MyAnnouncementsScreen from "../MyAnnouncementsScreen";

const MyAnnouncementsStack = createNativeStackNavigator();

const MyAnnouncementsStackScreen = ({ route, navigation }) => {
  const [userData, setUserData] = useState(route.params.userData);

  return (
    //<NavigationContainer>
    <MyAnnouncementsStack.Navigator screenOptions={{ headerShown: false }}>
      <MyAnnouncementsStack.Screen
        name="Lista moich ogloszen"
        component={MyAnnouncementsScreen}
        initialParams={{ userData: userData }}
      />
      <MyAnnouncementsStack.Screen
        name="Ogloszenie"
        component={AnnouncementView}
        initialParams={{ userData: userData }}
      />
      <MyAnnouncementsStack.Screen
        name="Dodaj Ogloszenie"
        component={AddAnnouncement}
        initialParams={{ photos: "" }}
      />
    </MyAnnouncementsStack.Navigator>
    //</NavigationContainer>
  );
};

export default MyAnnouncementsStackScreen;
