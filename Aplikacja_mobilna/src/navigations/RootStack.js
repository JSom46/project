import React from "react";

import { Colors } from "./../components/styles";

//React navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import Register from "./../screens/auth/Register";
import Login from "./../screens/auth/Login";
import Welcome from "./../screens/Welcome";
import MapMain from "./../screens/Map/MapMain";
import AddAnnouncement from "../screens/Map/AddAnnouncement";
import AnnouncementList from "../screens/Map/AnnouncementList";
//import { HeaderTitle } from "react-navigation-stack";

const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyled: {
            backgroundColor: "transparent",
          },
          headerTintColor: Colors.tetriary,
          headerTransparent: true,
          HeaderTitle: "",
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
        initialRouteName="Login"
      >
        <Stack.Screen
          options={{
            headerTransparent: false,
          }}
          name="Login"
          component={Login}
        />
        <Stack.Screen name="MapMain" component={MapMain} />
        <Stack.Screen name="Register" component={Register} />

        <Stack.Screen
          options={{ headerTintColor: Colors.secondary, headerShown: false }}
          name="AnnouncementList"
          component={AnnouncementList}
        />
        <Stack.Screen
          options={{ headerTintColor: Colors.secondary }}
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen
          options={{ headerTintColor: Colors.secondary }}
          name="AddAnnouncement"
          component={AddAnnouncement}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootStack;
