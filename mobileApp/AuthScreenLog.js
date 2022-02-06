import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button, TextInput, Touchable, TouchableHighlight } from 'react-native';
import {stylesAuth} from './styles'
import PropTypes from 'prop-types';
import {AuthContext} from './App'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

/*Ekran logowania - podstawowy ekran widoczny po wlaczeniu aplikacji (jesli uzytkownik nie jest zalogowany)*/

const AuthScreenLog = ({navigation}) => {
    const {logIn} = React.useContext(AuthContext);
    const {logInGoogle} = React.useContext(AuthContext);
    const {logInFacebook} = React.useContext(AuthContext);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const validate = () => {
        //regex do sprawdzania maila
        
        logIn({email, password});
            
    }

    return(
        <View style={stylesAuth.back}>
            <View style={stylesAuth.card}>
                <TextInput style={stylesAuth.input} placeholder='Email' onChangeText={setEmail}></TextInput>
                <TextInput style={stylesAuth.input} secureTextEntry={true} placeholder='Hasło' onChangeText={setPassword}></TextInput>

                {/* Przycisk logowania */}
                <TouchableHighlight
                    style={stylesAuth.button}
                    onPress={validate}
                    underlayColor={'#2670ab'}
                >
                    <Text style={stylesAuth.buttonText}>Zaloguj się</Text>
                </TouchableHighlight>

                {/* Przyciski logowania za pomoca Google i FB */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 5,
                }}>
                    <TouchableHighlight
                        style={stylesAuth.button}
                        onPress={logInGoogle}
                        underlayColor={'#2670ab'}
                    >
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <FontAwesomeIcon icon={['fab', 'google']} size={20} color='white'/>
                            <Text style={[stylesAuth.buttonText, {marginLeft: 5}]}>Google</Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight
                        style={stylesAuth.button}
                        onPress={logInFacebook}
                        underlayColor={'#2670ab'}
                    >
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <FontAwesomeIcon icon={['fab', 'facebook']} size={20} color='white'/>
                            <Text style={[stylesAuth.buttonText, {marginLeft: 5}]}>Facebook</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                
                {/* Przycisk przekierowujacy do aktywacji konta */}
                <TouchableHighlight
                    style={stylesAuth.button}
                    onPress={() => navigation.navigate('Aktywacja')}
                    underlayColor={'#2670ab'}
                >
                    <Text style={stylesAuth.buttonText}>Aktywuj konto</Text>
                </TouchableHighlight>
                
                {/* Napis i przycisk do rejestracji */}
                <View style={{marginTop: 20, alignItems: 'center'}}>
                    <Text style={{color: 'black'}}>Nie masz konta?</Text>

                    <TouchableHighlight
                        style={stylesAuth.button}
                        onPress={() => navigation.navigate('Rejestracja')}
                        underlayColor={'#2670ab'}
                    >
                        <Text style={stylesAuth.buttonText}>Zarejestruj się</Text>
                    </TouchableHighlight>
                </View>

            </View>
        </View>
    )
}

export default AuthScreenLog;