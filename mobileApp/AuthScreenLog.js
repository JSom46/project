import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import stylesAuth from './styles'
import PropTypes from 'prop-types';
import {AuthContext} from './App'

const AuthScreenLog = ({navigation}) => {
    const {logIn} = React.useContext(AuthContext);

    return(
        <View style={stylesAuth.back}>
            <View style={stylesAuth.card}>
                <TextInput style={stylesAuth.input} placeholder='Login'></TextInput>
                <TextInput style={stylesAuth.input} secureTextEntry={true} placeholder='Hasło'></TextInput>
                <Button
                    title='Zaloguj się'
                    onPress={() => logIn('login', 'haslo')}
                    style={{margin: 5}}
                />
                <Text style={{marginTop: 10}}>Nie masz konta?</Text>
                <Button
                    title='Zarejestruj się'
                    onPress={() => navigation.navigate('Rejestracja')}
                    style={{margin: 5}}
                />
            </View>
        </View>
    )
}

export default AuthScreenLog;