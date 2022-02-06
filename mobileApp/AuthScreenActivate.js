import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, TextInput, TouchableHighlight } from 'react-native';
import {stylesAuth} from './styles'
import {AuthContext} from './App'
import { HeaderBackButton } from '@react-navigation/stack';

const AuthScreenActivate = ({navigation}) => {
    const {activate} = React.useContext(AuthContext);

    const [email, setEmail] = React.useState('');
    const [code, setCode] = React.useState('');

    const validate = () => {
        //regex do sprawdzania maila
        //sprawdzanie poprawdnosci kodu
        
        if(activate({email, code})){
            navigation.navigate('Logowanie');
        }
    }

    return(
        <View style={stylesAuth.back}>
            <View style={stylesAuth.card}>
                <TextInput style={stylesAuth.input} placeholder='Adres email' onChangeText={setEmail}></TextInput>
                <TextInput style={stylesAuth.input} placeholder='Kod aktywacyjny' onChangeText={setCode}></TextInput>

                {/* Przycisk aktywacji */}
                <TouchableHighlight
                    style={[stylesAuth.button, {marginTop: 15}]}
                    onPress={validate}
                    underlayColor={'#2670ab'}
                >
                    <Text style={stylesAuth.buttonText}>Aktywuj konto</Text>
                </TouchableHighlight>

            </View>
        </View>
    )
}

export default AuthScreenActivate;