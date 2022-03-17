import React from 'react';
import { View, Text, Button, StatusBar} from 'react-native';
import {AuthContext} from './App'
import {stylesHome} from './styles';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import MapView from 'react-native-maps';
import { UrlTile, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';
import { StyleSheet } from "react-native"
import MainMap from './MainMap';


const Dashboard = ({navigation}) => {
    const {logOut} = React.useContext(AuthContext);

    return(

        // <View style={{
        //     flex: 1
        //   }}>
        //     <MapView
        //         style={{
        //             ...StyleSheet.absoluteFillObject,
        //           }}
        //         initialRegion={{
        //             latitude: 53.022222,
        //             longitude: 18.611111,
        //             latitudeDelta: 0.0922,
        //             longitudeDelta: 0.0421,
        //         }}
        //     />
        // </View>
        

        <View style={{flex: 1}}>
            <MainMap/>  
        </View>




        
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