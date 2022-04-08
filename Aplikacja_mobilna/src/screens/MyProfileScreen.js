import React, {useRef, useState} from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { stylesHome, stylesMyProfileContainer, stylesMyProfileButton, stylesMyProfileTextInput } from '../components/styles';

const MyProfileScreen = ({navigation, route}) => {
    const [message, setMessage] = useState("");
    const [userData, setUserData] = useState(route.params.userData);
    const loginFormRef = useRef();
    const passwordFormRef = useRef()

    React.useEffect(() => {
        const handleLoggedIn = () => {
            const url = "http://" + serwer + "/auth/loggedin";
            axios
              .get(url)
              .then((response) => {
                const result = response.data;
                console.log(result);
                const { message, status, data } = result;
                if (response.status == "200") {
                  setUserData(result)
                }
                })
              .catch((error) => {
                console.log("Nie jesteś zalogowany");
              });
        };
        handleLoggedIn();

        setMessage("");
        loginFormRef.current.resetForm();
    }, []);

    const updateLogin = (values) => {
        var data = JSON.stringify({
            new_login: values.login,
        });

        var config = {
            method: "patch",
            url: "http://" + serwer + "/auth/user",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
        };

        axios(config)
        .then((response)=>{
            if(response.status == "200"){
                alert("Pomyślnie zmieniono login!");
                loginFormRef.current.resetForm();
            }else if(response.msg == "login too long"){
                setMessage("Nowy login jest zbyt długi!");
            }else{
                setMessage("Błąd! Nie udało się zmienić danych!");
            }
        })
    };

    const sendMail = (mailAddress) => {
        var data = JSON.stringify({
            email: mailAddress,
        });

        var config = {
            method: "post",
            url: "http://" + serwer + "/auth/requestPasswordChange",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
        };

        axios(config)
        .then((response)=>{
            if(response.status == "200"){
                alert("Wysłano maila z kodem do zmiany hasła");
                passwordFormRef.current.resetForm();
            }else{
                setMessage("Błąd! Nie udało się wysłać maila!");
            }
        })
    };

    const updatePassword = (values) => {
        var data = JSON.stringify({
            id: values.id,
            token: values.token,
            password: values.newPassword,
        });

        var config = {
            method: "patch",
            url: "http://" + serwer + "/auth/passwordChange",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
        };

        axios(config)
        .then((response)=>{
            if(response.status == "200"){
                alert("Pomyślnie zmieniono hasło!");
                passwordFormRef.current.resetForm();
            }else if(response.status == "password too weak"){
                setMessage("Nowe hasło jest zbyt słabe!");
            }else if(response.msg == "invalid token"){
                setMessage("Nieprawidłowy kod!");
            }else{
                setMessage("Błąd! Nie udało się zmienić danych!");
            }
        })
    };


    return(
        <ScrollView  contentContainerStyle={{flexGrow: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'column'}}>
            <View style={{marginTop: 5}}>
                <Text style={{fontSize: 32, alignSelf: 'center'}}>
                    {userData.login}
                </Text>
                <Text style={{alignSelf: 'center'}}>
                    {userData.email}
                </Text>
            </View>

        {/* Formularz do zmiany loginu*/}
        <Formik
            initialValues={{ login: userData.login}}
            innerRef={loginFormRef}
            onSubmit={(values) => {
                if(values.login == ""){
                    setMessage("Login nie może być pusty!");
                }else{
                    //wywolaj zmiane loginu
                    updateLogin(values);
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{width: '90%'}}>
                        <Text style={{fontSize: 16}}>Login</Text>
                        <TextInput
                            onChangeText={handleChange('login')}
                            onBlur={handleBlur('login')}
                            value={values.login}
                            style={stylesMyProfileTextInput}
                            placeholder="Login"
                        />

                        <TouchableOpacity style={[stylesMyProfileButton, {marginTop: 5, marginBottom: 5}]} onPress={handleSubmit}>
                            <Text style={{fontSize: 20, fontWeight: "600"}}>Zmień login</Text>
                        </TouchableOpacity>
                </View>
            )}
        </Formik>

        {/* Formularz do zmiany hasła */}
        <Formik
            initialValues={{ id: userData.user_id, newPassword: '', token: '' }}
            innerRef={passwordFormRef}
            onSubmit={(values) => { 
                if(values.token == "" || values.newPassword == ""){
                    setMessage("Musisz podać kod i nowe hasło!");
                }else{
                    //wywolaj zmiane hasla
                    updatePassword(values);
                }
            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{width: '90%'}}>
                        {/* <Text style={{fontSize: 16}}>Obecne hasło</Text>
                        <TextInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={stylesMyProfileTextInput}
                            placeholder="Hasło"
                            secureTextEntry={true}
                        /> */}

                        <TouchableOpacity style={[stylesMyProfileButton, {marginBottom: 10}]} onPress={() => sendMail(userData.email)}>
                            <Text style={{fontSize: 20, fontWeight: "600"}}>Wyślij maila z kodem do zmiany hasła</Text>
                        </TouchableOpacity>

                        <Text style={{fontSize: 16}}>Nowe hasło</Text>
                        <TextInput
                            onChangeText={handleChange('newPassword')}
                            onBlur={handleBlur('newPassword')}
                            value={values.newPassword}
                            style={stylesMyProfileTextInput}
                            placeholder="Nowe hasło"
                            secureTextEntry={true}
                        />

                        <Text style={{fontSize: 16}}>Podaj kod z maila</Text>
                        <TextInput
                            onChangeText={handleChange('token')}
                            onBlur={handleBlur('token')}
                            value={values.token}
                            style={stylesMyProfileTextInput}
                            placeholder="Kod z maila"
                        />

                        <TouchableOpacity style={[stylesMyProfileButton, {marginTop: 10}]} onPress={handleSubmit}>
                            <Text style={{fontSize: 20, fontWeight: "600"}}>Zmień hasło</Text>
                        </TouchableOpacity>

                        <Text style={{color: 'red', textAlign: 'center', marginTop: 5}}>{message}</Text>

                </View>
            )}
        </Formik>
            

        </ScrollView>
    )
}

export default MyProfileScreen;