import React from 'react';
import { View, Text, Button, TextInput, TouchableHighlight} from 'react-native';
import {stylesAuth} from './styles'
import { AuthContext } from './App';

const AuthScreenSign = ({navigation}) => {
    const {signUp} = React.useContext(AuthContext);

    const [login, setLogin] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordRepeat, setPasswordRepeat] = React.useState('');

    const validate = () => {
        if(password !== passwordRepeat){
            alert("Hasła nie są takie same.");
            return -1;
        }

        //regex do sprawdzania maila
        
        if(signUp({login, email, password})){
            navigation.navigate('Aktywacja');
        }
    }

    return(
        <View style={stylesAuth.back}>
            <View style={stylesAuth.card}>
                <TextInput style={stylesAuth.input} placeholder='Login' onChangeText={setLogin}></TextInput>
                <TextInput style={stylesAuth.input} secureTextEntry={true} placeholder='Hasło' onChangeText={setPassword}></TextInput>
                <TextInput style={stylesAuth.input} secureTextEntry={true} placeholder='Powtórz hasło' onChangeText={setPasswordRepeat}></TextInput>
                <TextInput style={stylesAuth.input} placeholder='Adres email' onChangeText={setEmail}></TextInput>

                <TouchableHighlight
                    style={[stylesAuth.button, {marginTop: 15}]}
                    onPress={validate}
                    underlayColor={'#2670ab'}
                >
                    <Text style={stylesAuth.buttonText}>Zarejestruj się</Text>
                </TouchableHighlight>

            </View>
        </View>
    )
}

export default AuthScreenSign;