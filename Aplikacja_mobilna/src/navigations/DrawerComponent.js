import React, {useEffect, useState, useContext} from 'react';
import { NavigationContainer, StackActions } from "@react-navigation/native";
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
import AddAnnouncement from '../screens/Map/AddAnnouncement';
import MyAnnouncementsStackScreen from '../screens/Announcements/MyAnnouncementsStackScreen';

import axios from "axios";
import Welcome from '../screens/Welcome';

const Drawer = createDrawerNavigator();


const DrawerComponent = ({navigation, route}) => {
    //const {logOut} = React.useContext(AuthContext);
    const [userData, setUserData] = useState(route.params.userData);

    const handleLogout = (credentials) => {
      console.log(credentials);
      const url = "http://" + serwer + "/auth/logout";
  
      axios
        .get(url, {credentials: 'same-origin'})
        .then((response) => {
          const result = response.data;
          const { message, status, data } = result;
          if (response.status == "200") {
            //navigation.navigate("Login");
            setUserData(guestData);
            navigation.navigate('Nawigator');
            console.log("Wylogowano");
            alert("Pomyślnie wylogowano");
          }
        })
        .catch((error) => {
          console.log(error.JSON());
        });
    };
  
    const handleLoggedIn = (credentials) => {
      const url = "http://" + serwer + "/auth/loggedin";
      console.log(url);
      axios
        .get(url, {credentials: 'same-origin'})
        .then((response) => {
          const result = response.data;
          //console.log(result);
          const { message, status, data } = result;
          if (response.status == "200") {
            handleLogout(result.email);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    console.log("w drawerze: ", userData);

    return(
        //Customizowanie DrawerNavigatora przez dodanie DrawerItem - przycisku do wylogowania
        <Drawer.Navigator drawerContent={props => {
            return (
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                
                {userData.user_id == "guestId" ? (
                  <DrawerItem 
                      label={({focused, size}) => (
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <Text style={{color: 'gray'}}>Zaloguj się</Text>
                          </View>
                      )}
                      onPress={() => navigation.navigate('Login')}
                  />
                ) : (
                  <DrawerItem 
                      label={({focused, size}) => (
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <Text style={{color: 'gray'}}>Wyloguj</Text>
                          </View>
                      )}
                      //onPress={logOut} 
                      onPress={() => handleLoggedIn()}
                  />
              )}
              </DrawerContentScrollView>
            )
        }}>
            
            {userData.user_id == "guestId" ? (
              <>
              <Drawer.Screen
                name='Strona domowa'
                component={Dashboard}
              />
              <Drawer.Screen
                name='Ogłoszenia'
                component={AnnouncementsScreen}
              />
              </>
            ):(
              <>
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
                    initialParams={{userData: userData}}
                />
                <Drawer.Screen
                  name='Moje Ogłoszenia'
                  component={MyAnnouncementsStackScreen}
                />
                <Drawer.Screen
                    name='Powiadomienia'
                    component={NotificationsScreen}
                />
                {/* <Drawer.Screen
                  name="Dodaj Ogłoszenie"
                  component={AddAnnouncement}
                /> */}
              </>
            )}


            {/* <Drawer.Screen
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
                //initialParams={{userData: route.params.userData}}
                initialParams={{userData: userData}}
            />
            
            <Drawer.Screen
              name='Moje Ogłoszenia'
              component={MyAnnouncementsScreen}
            />
            
            <Drawer.Screen
                name='Powiadomienia'
                component={NotificationsScreen}
            />
            <Drawer.Screen
              name="Dodaj Ogłoszenie"
              component={AddAnnouncement}
            /> */}
        </Drawer.Navigator>
    )
    
}

export default DrawerComponent;