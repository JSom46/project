import React from 'react';
import { View, Text, Button, StatusBar} from 'react-native';
import {AuthContext} from './App'
import {stylesHome} from './styles';

const HomeScreen = () => {
    const {logOut} = React.useContext(AuthContext);

    return(
        
        <View style={stylesHome.dashboard}>
            
            <Text style={{fontSize: 32}}>
                Witaj!
            </Text>
            <Button
                title='Wyloguj się'
                onPress={logOut}
            />
        </View>
    )
}

export default HomeScreen;