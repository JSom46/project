import React, {useEffect, useState} from 'react';
import { NavigationContainer } from "@react-navigation/native";
//import { createDrawerNavigator } from '@react-navigation/drawer';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

import {AuthContext} from './App'
import Dashboard from './Dashboard';
import NotificationsScreen from './NotificationsScreen';
import { View, Text } from 'react-native';
import AnnouncementsScreen from './AnnouncementsScreen';
import MyProfileScreen from './MyProfileScreen';
import MyAnnouncementsScreen from './MyAnnouncementsScreen';
import AnnouncementView from './AnnouncementView';

const Drawer = createDrawerNavigator();

/*Potencjalnie wrzucic funkcje pobierajce ogloszenia do kontekstu i uzywac go w Dashboard (i dalej w MainMap) i AnnouncementList
Być może dać pobieranie ogłoszeń w Memo*/
//export const AnnouncementsContext = React.createContext();


/*Odkomentowac jesli jednak pobieramy dane tutaj i przekazujemy do potomnych komponentow*/
// function createData(id, title, category, image, lat, lng, type) {
//     return { id, title, category, image, lat, lng, type };
// }
// async function getAnnouncements(){
//     try {
//         let response = await fetch('http://'+ adresSerwera +':2400/anons/list');
//         let json = await response.json();

//         let rows = [];

//         json.list.forEach(element => {
//             rows.push(createData(
//                 element.id,
//                 element.title,
//                 (element.category === 0 ? "Zaginięcie" : "Znalezienie"),
//                 element.image,
//                 element.lat,
//                 element.lng,
//                 element.type
//             ));
//         });

//         return rows;
//       } catch (error) {
//          console.error(error);
//       }
// };




const DrawerComponent = ({navigation, route}) => {
    const {logOut} = React.useContext(AuthContext);


    /*Odkomentowac jesli jednak pobieramy dane tutaj i przekazujemy do potomnych komponentow*/
    // const [data, setData] = useState([]);
    // useEffect(() => {
    //     getAnnouncements().then(rows => setData(rows));
    //     //console.log(data);
    // }, []);


    return(
    //<NavigationContainer>
        //Customizowanie DrawerNavigatora przez dodanie DrawerItem - przycisku do wylogowania
        <Drawer.Navigator drawerContent={props => {
            return (
              <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem 
                    label={({focused, size}) => (
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{marginRight: 10, fontSize: 15, fontWeight: '500'}}>Wyloguj</Text>
                            <FontAwesomeIcon icon={['fas', 'sign-out-alt']} size={16} color='black'/>
                        </View>
                    )}
                    onPress={logOut} 
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
                initialParams={{login: route.params.login}}
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
    //</NavigationContainer>
    )
    
}

export default DrawerComponent;