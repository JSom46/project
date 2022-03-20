import React from 'react';
import { View, Text, Button, StatusBar} from 'react-native';
import {AuthContext} from './App'
import {stylesHome} from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import MapView from 'react-native-maps';
import { UrlTile, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';
import { StyleSheet } from "react-native"
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import MainMap from './MainMap';
import AnnouncementView from './AnnouncementView';

const MapAnnouncementsStack = createNativeStackNavigator();

const Dashboard = ({navigation}) => {
    const {logOut} = React.useContext(AuthContext);

    return(
        
        <MapAnnouncementsStack.Navigator style={{flex: 1}} screenOptions={{headerShown: false}}>
            <MapAnnouncementsStack.Screen name="Mapa" component={MainMap} navigation={navigation}/>
            <MapAnnouncementsStack.Screen name="Ogloszenie" component={AnnouncementView}/>
        </MapAnnouncementsStack.Navigator>



        
        // <View style={stylesHome.dashboard}>
        //     {/* <Text style={{fontSize: 32}}>
        //         Witaj!
        //     </Text>
        //     <Button
        //         title='Wyloguj się'
        //         onPress={logOut}
        //     /> */}

        // </View>
    )
}

export default Dashboard;