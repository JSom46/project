import React from 'react';
import { View, Text, Button, StatusBar} from 'react-native';
import {AuthContext} from './App'

const HomeScreen = () => {
    const {logOut} = React.useContext(AuthContext);

    return(
        <View>
            
            <Text style={{fontSize: 32}}>
                Witaj!
            </Text>
            <Text>
                Zalogowales sie.
            </Text>
            <Button
                title='Wyloguj się'
                onPress={logOut}
            />
        </View>
    )
}

export default HomeScreen;