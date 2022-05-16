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
import { userDataContext } from "../UserDataContext";
import AddNotification from "./AddNotification";
import ImageBrowser from "../ImageBrowserScreen";
import NotificationList from "../Notifications/NotificationsList";
import EditAnnouncement from "./EditAnnouncement";

const MyAnnouncementsStack = createNativeStackNavigator();

const MyAnnouncementsStackScreen = ({ route, navigation }) => {
  //const [userData, setUserData] = useState(route.params.userData);
  const { userData, setUserData } = React.useContext(userDataContext);

  return (
    //<NavigationContainer>
    <MyAnnouncementsStack.Navigator screenOptions={{ headerShown: false }}>
      <MyAnnouncementsStack.Screen
        name="Lista moich ogloszen"
        component={MyAnnouncementsScreen}
        //initialParams={{ userData: userData }}
      />
      <MyAnnouncementsStack.Screen
        name="Ogloszenie"
        component={AnnouncementView}
        //initialParams={{ userData: userData }}
      />
      <MyAnnouncementsStack.Screen
        name="AddNotification"
        component={AddNotification}
        options={{}}
      />
      <MyAnnouncementsStack.Screen
        name="Powiadomienia"
        component={NotificationList}
        options={{
          headerShown: false,
        }}
      />

      <MyAnnouncementsStack.Screen
        name="Dodaj Ogloszenie"
        component={AddAnnouncement}
        initialParams={{ photos: "" }}
      />
      {/* <MyAnnouncementsStack.Screen
        name="ImageBrowser"
        component={ImageBrowser}
        options={{
          headerShown: true,
          title: "Wybrano 0 ",
          headerTransparent: false,
        }}
        initialParams={{
          count: "",
        }}
      /> */}
      <MyAnnouncementsStack.Screen
        name="EditAnnouncement"
        component={EditAnnouncement}
        options={{
          headerShown: false,
          headerTransparent: false,
        }}
      />
    </MyAnnouncementsStack.Navigator>
    //</NavigationContainer>
  );
};

export default MyAnnouncementsStackScreen;
