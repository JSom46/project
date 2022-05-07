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
import { userDataContext } from "../UserDataContext";
import ImageBrowser from "../ImageBrowserScreen";
import EditAnnouncement from "./EditAnnouncement";
import NotificationList from "../Notifications/NotificationsList";

const AnnouncementsStack = createNativeStackNavigator();

const AnnouncementsScreen = ({ route, navigation }) => {
  //const [userData, setUserData] = useState(route.params.userData);
  const { userData, setUserData } = React.useContext(userDataContext);

  return (
    //<NavigationContainer>
    <AnnouncementsStack.Navigator screenOptions={{ headerShown: false }}>
      <AnnouncementsStack.Screen
        name="Lista"
        component={AnnouncementsList}
        //initialParams={{userData: userData}}
      />
      <AnnouncementsStack.Screen
        name="Ogloszenie"
        component={AnnouncementView}
      />

      <AnnouncementsStack.Screen
        name="Powiadomienia"
        component={NotificationList}
        options={{
          headerShown: false,
        }}
      />
      <AnnouncementsStack.Screen
        name="Dodaj Ogloszenie"
        component={AddAnnouncement}
        options={{
          headerShown: false,
        }}
        initialParams={{ photos: "" }}
      />
      {/* 
      <AnnouncementsStack.Screen
        name="ImageBrowser"
        component={ImageBrowser}
        options={{
          title: "Selected 0 files",
          headerTransparent: false,
        }}
        initialParams={{
          count: "",
        }}
      /> */}

      <AnnouncementsStack.Screen
        name="EditAnnouncement"
        component={EditAnnouncement}
        options={{
          headerShown: false,
          headerTransparent: false,
        }}
      />
    </AnnouncementsStack.Navigator>
    //</NavigationContainer>
  );
};

export default AnnouncementsScreen;
