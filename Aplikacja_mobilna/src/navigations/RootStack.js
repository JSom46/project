import React, { useState } from "react";

import { Colors } from "./../components/styles";

//React navigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import Register from "./../screens/auth/Register";
import Login from "./../screens/auth/Login";

import AddAnnouncement from "../screens/Map/AddAnnouncement";
import SplashScreen from "../screens/SplashScreen";
import { State } from "react-native-gesture-handler";
//import { HeaderTitle } from "react-navigation-stack";
import axios from "axios";
import DrawerComponent from "./DrawerComponent";

import Filter from "../screens/Map/Filter";
import ImageBrowser from "../screens/ImageBrowserScreen";
import AddNotification from "../screens/Announcements/AddNotification";

const Stack = createStackNavigator();

//export const AuthContext = React.createContext();

const RootStack = () => {
  //const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState();
  //const [initialRoute, setInitialRoute] = useState("Nawigator");
  //const guestData = {user_id: "guestId", email: "guest@email", login: "guest", is_admin: 0};

  // const authContextData = React.useMemo(() => ({
  //   LoginGoogle: async () => {
  //     const data = await fetch("http://" + serwer + "/auth/google/url", {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     return await data.json();
  //   },

  //   LoginGoogleFunc: async (e) => {
  //     e.preventDefault();
  //     const response = await LoginGoogle();
  //     console.log(response.url);
  //     Linking.openURL(response.url).catch((err) =>
  //       console.error("Couldn't load page", err)
  //     );
  //   },

  //   LoginFacebook: async () => {
  //     const data = await fetch("http://" + serwer + "/auth/facebook/url", {
  //       method: "GET",
  //       credentials: "include",
  //     });
  //     return await data.json();
  //   },

  //   LoginFacebookFunc: async (e) => {
  //     e.preventDefault();
  //     const response = await LoginFacebook();
  //     console.log(response.url);
  //     Linking.openURL(response.url).catch((err) =>
  //       console.error("Couldn't load page", err)
  //     );
  //   },

  //   handleMessage: (message, type = "FALSE") => {
  //     setMessage(message);
  //     setMessageType(type);
  //   },

  //   handleLogin: (credentials) => {
  //     handleMessage(null);
  //     var data = JSON.stringify({
  //       //email: "matmar@loremipsummail.com",
  //       //password: "noweHaslo12",
  //       email: "admin@trash-mail.com",
  //       password: "admin",
  //     });
  //     var config = {
  //       method: "post",
  //       url: "http://" + serwer + "/auth/login",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       data: data,
  //     };
  //     console.log(data);
  //     axios(config)
  //       .then((response) => {
  //         try {
  //           const result = response.data;
  //           const { message, status, data } = result;
  //           console.log("dostalem");
  //           // console.log(response.status);
  //           if (response.status == "200") {
  //             console.log("zalogowano");
  //             //navigation.navigate("Welcome");
  //             setUserToken("token");
  //           } else {
  //             console.log("nie zalogowano");
  //           }
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error.response.data.msg);
  //         if (error.response.data.msg == "account not active") {
  //           handleMessage("Konto nieaktywne");
  //         } else handleMessage("Podany email i/lub hasło są nieprawidłowe.");
  //       });
  //   },

  //   handleLogout: (credentials) => {
  //     const url = "http://" + serwer + "/auth/logout";

  //     axios
  //       .get(url)
  //       .then((response) => {
  //         const result = response.data;
  //         const { message, status, data } = result;
  //         if (response.status == "200") {
  //           console.log("wylogowano");
  //         }
  //       })
  //       .catch((error) => {
  //         //setSubmitting(false);
  //         console.log(error.response);
  //       });
  //   },
  // }),
  // []
  // )

  //sprawdzanie po wlaczeniu aplikacji czy uzytkownik jest zalogowany
  React.useEffect(() => {
    const handleLoggedIn = () => {
      const url = "http://" + serwer + "/auth/loggedin";
      //console.log("RootStack useEffect");

      axios
        .get(url)
        .then((response) => {
          const result = response.data;
          console.log(result);
          const { message, status, data } = result;
          if (response.status == "200") {
            console.log(result.email);
            //navigation.replace('Nawigator', {userData: result});
            //setInitialRouteName("");
            setUser(result);
          }
        })

        .catch((error) => {
          //console.log(error);
          console.log("Nie jesteś zalogowany");
          //navigation.replace('Nawigator', {userData: guestData});
          setUser(guestData);
        })
        .finally(() => setIsLoading(false));
    };
    handleLoggedIn();
  }, []);

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
        //initialRouteName={initialRoute}
      >
        {isLoading == true ? (
          <Stack.Screen name="Loading" component={SplashScreen} />
        ) : (
          <>
            <Stack.Screen
              options={{ headerShown: false }}
              name="Nawigator"
              component={DrawerComponent}
              initialParams={{ userData: user }}
            />
            <Stack.Screen
              options={{
                headerTransparent: false,
              }}
              name="Login"
              component={Login}
            />

            <Stack.Screen name="Register" component={Register} />
          </>
        )}
        <Stack.Screen
          options={{
            headerTransparent: false,
          }}
          name="Filtry"
          component={Filter}
        />
        <Stack.Screen
          name="ImageBrowser"
          component={ImageBrowser}
          options={{
            title: "Selected 0 files",
            headerTransparent: false,
          }}
        />
        <Stack.Screen
          name="AddAnnouncement"
          component={AddAnnouncement}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="AddNotification"
          component={AddNotification}
          options={{
            title: "Wyślij powiadomienie",
            headerShown: true,
          }}
        />

        {/* <Stack.Screen name="MapMain" component={MapMain} />
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
          /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootStack;
