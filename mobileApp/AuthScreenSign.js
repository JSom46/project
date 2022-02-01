import React from 'react';
import { View, Text, Button, TextInput} from 'react-native';
import stylesAuth from './styles'
import { AuthContext } from './App';

const AuthScreenSign = () => {
    const {signUp} = React.useContext(AuthContext);

    return(
        <View style={stylesAuth.back}>
            <View style={stylesAuth.card}>
                <TextInput style={stylesAuth.input} placeholder='Login'></TextInput>
                <TextInput style={stylesAuth.input} secureTextEntry={true} placeholder='Hasło'></TextInput>
                <TextInput style={stylesAuth.input} secureTextEntry={true} placeholder='Powtórz hasło'></TextInput>
                <TextInput style={stylesAuth.input} placeholder='Adres email'></TextInput>

                <Button
                    title='Zarejestruj się'
                    onPress={() => signUp("login", "haslo")}
                />
            </View>
        </View>
    )
}

export default AuthScreenSign;