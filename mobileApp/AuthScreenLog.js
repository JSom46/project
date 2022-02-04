import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, TextInput, Touchable, TouchableHighlight } from 'react-native';
import {stylesAuth} from './styles'
import PropTypes from 'prop-types';
import {AuthContext} from './App'

/*Ekran logowania - podstawowy ekran widoczny po wlaczeniu aplikacji (jesli uzytkownik nie jest zalogowany)*/

const AuthScreenLog = ({navigation}) => {
    const {logIn} = React.useContext(AuthContext);
    const {logInGoogle} = React.useContext(AuthContext);
    const {logInFacebook} = React.useContext(AuthContext);

    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();

    const validate = () => {
        //regex do sprawdzania maila
        
        logIn({email, password});
            
    }

    return(
        <View style={stylesAuth.back}>
            <View style={stylesAuth.card}>
                <TextInput style={stylesAuth.input} placeholder='Email' onChangeText={setEmail}></TextInput>
                <TextInput style={stylesAuth.input} secureTextEntry={true} placeholder='Hasło' onChangeText={setPassword}></TextInput>
                <Button
                    title='Zaloguj się'
                    onPress={validate}
                    style={{margin: 5}}
                />

                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Button
                        title='Google'
                        onPress={logInGoogle}
                    />

                    <Button
                        title='Facebook'
                        onPress={logInFacebook}
                    />
                </View>
                
                <Text style={{marginTop: 10}}>Nie masz konta?</Text>
                <Button
                    title='Zarejestruj się!'
                    onPress={() => navigation.navigate('Rejestracja')}
                    style={{margin: 5}}
                />
                <Button
                    title='Aktywuj konto'
                    onPress={() => navigation.navigate('Aktywacja')}
                    style={{margin: 5}}
                />
            </View>
        </View>
    )
}

export default AuthScreenLog;