import React from 'react';
import { View, Text} from 'react-native';
import {stylesHome} from './styles';

const NotificationsScreen = ({navigation}) => {

    return(
        
        <View style={stylesHome.dashboard}>
            
            <Text style={{fontSize: 32}}>
                Powiadomienia.
            </Text>

        </View>
    )
}

export default NotificationsScreen;