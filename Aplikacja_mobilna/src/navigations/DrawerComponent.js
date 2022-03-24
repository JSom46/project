import React, {useEffect, useState} from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'

// import {AuthContext} from './App'
import Dashboard from '../screens/Dashboard';
import NotificationsScreen from '../screens/NotificationsScreen';
import { View, Text } from 'react-native';
import AnnouncementsScreen from '../screens/Announcements/AnnouncementsScreen';
// import MyProfileScreen from './MyProfileScreen';
import MyProfileScreen from '../screens/MyProfileScreen';
// import MyAnnouncementsScreen from './MyAnnouncementsScreen';
import MyAnnouncementsScreen from '../screens/MyAnnouncementsScreen';
// import AnnouncementView from './AnnouncementView';

import axios from "axios";

const Drawer = createDrawerNavigator();

const DrawerComponent = ({navigation, route}) => {
    //const {logOut} = React.useContext(AuthContext);

    const handleLogout = (credentials) => {
        console.log(credentials);
        const url = "http://" + serwer + "/auth/logout";
    
        axios
          .get(url, credentials)
          .then((response) => {
            const result = response.data;
            const { message, status, data } = result;
            if (response.status == "200") {
              navigation.navigate("Login");
            }
          })
          .catch((error) => {
            console.log(error.JSON());
          });
      };
    
      const handleLoggedIn = () => {
        const url = "http://" + serwer + "/auth/loggedin";
    
        const a = axios
          .get(url)
          .then((response) => {
            const result = response.data;
            const { message, status, data } = result;
            if (response.status == "200") {
              handleLogout(result.email);
            }
          })
          .catch((error) => {
            console.log(error.JSON());
          }); 
      };

    return(
        //Customizowanie DrawerNavigatora przez dodanie DrawerItem - przycisku do wylogowania
        <Drawer.Navigator drawerContent={props => {
            return (
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem 
                    label={({focused, size}) => (
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{color: 'gray'}}>Wyloguj</Text>
                        </View>
                    )}
                    //onPress={logOut} 
                    onPress={handleLoggedIn}
                />
              </DrawerContentScrollView>
            )
        }}>
            <Drawer.Screen
                name='Strona domowa'
                component={Dashboard}
            />
            <Drawer.Screen
                name='Ogłoszenia'
                component={AnnouncementsScreen}
            />
            <Drawer.Screen
                name='Profil'
                component={MyProfileScreen}
                //initialParams={{login: route.params.login}}
            />
            <Drawer.Screen
            name='Moje Ogłoszenia'
            component={MyAnnouncementsScreen}
            />
            <Drawer.Screen
                name='Powiadomienia'
                component={NotificationsScreen}
            />

        </Drawer.Navigator>
    )
    
}

export default DrawerComponent;