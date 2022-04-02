import React, {useRef, useState} from 'react';
import { View, Text, TouchableOpacity, TextInput} from 'react-native';
import { Formik } from 'formik';
import axios from 'axios';
import { stylesHome, stylesMyProfileContainer, stylesMyProfileButton, stylesMyProfileTextInput } from '../components/styles';

const MyProfileScreen = ({navigation, route}) => {
    const [message, setMessage] = useState("");
    const [userData, setUserData] = useState(route.params.userData);
    const formRef = useRef()

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
        formRef.current.resetForm();
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
                formRef.current.resetForm();
            }else if(response.msg == "login too long"){
                setMessage("Nowy login jest zbyt długi!");
            }else{
                setMessage("Błąd! Nie udało się zmienić danych!");
            }
        })
    };

    const updatePassword = (values) => {
        var data = JSON.stringify({
            password: values.password,
            new_password: values.newPassword
        });

        var config = {
            method: "patch",
            url: "http://" + serwer + "/auth/user/password",
            headers: {
              "Content-Type": "application/json",
            },
            data: data,
        };

        axios(config)
        .then((response)=>{
            if(response.status == "200"){
                alert("Pomyślnie zmieniono hasło!");
            }else if(response.msg == "password too weak"){
                setMessage("Nowe hasło jest zbyt słabe!");
            }else if(response.msg == "invalid password"){
                setMessage("Nieprawidłowe hasło!");
            }else{
                setMessage("Błąd! Nie udało się zmienić danych!");
            }
        })
    };



    return(
        <View style={stylesMyProfileContainer}>
            <View style={{flex: 1, marginTop: 5}}>
                <Text style={{fontSize: 32, alignSelf: 'center'}}>
                    {userData.login}
                </Text>
                <Text style={{alignSelf: 'center'}}>
                    {userData.email}
                </Text>
            </View>

        <Formik
            initialValues={{ login: userData.login, password: '', newPassword: '', repeatNewPassword: '' }}
            innerRef={formRef}
            onSubmit={(values) => {
                if(values.login == ""){
                    setMessage("Login nie może być pusty!");
                }else{
                    //wywolaj zmiane loginu
                    updateLogin(values);
                }

                if(values.password != ""){
                    if((values.newPassword == values.repeatNewPassword) && values.newPassword != ""){
                        //wywolaj zmiane hasla
                        updatePassword(values);
                    }else{
                        setMessage("Hasła muszą być takie same!");
                    }
                }else if(values.password == "" && (values.newPassword != "" || values.repeatNewPassword != "")){
                    setMessage("Jeśli chcesz zmienić hasło, podaj aktualne hasło!");
                }

            }}
        >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{flex: 4, width: '90%'}}>
                        <Text style={{fontSize: 16}}>Login</Text>
                        <TextInput
                            onChangeText={handleChange('login')}
                            onBlur={handleBlur('login')}
                            value={values.login}
                            style={stylesMyProfileTextInput}
                            placeholder="Login"
                        />

                        <Text style={{fontSize: 16}}>Obecne hasło</Text>
                        <TextInput
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            style={stylesMyProfileTextInput}
                            placeholder="Hasło"
                            secureTextEntry={true}
                        />

                        <Text style={{fontSize: 16}}>Nowe hasło</Text>
                        <TextInput
                            onChangeText={handleChange('newPassword')}
                            onBlur={handleBlur('newPassword')}
                            value={values.newPassword}
                            style={stylesMyProfileTextInput}
                            placeholder="Nowe hasło"
                            secureTextEntry={true}
                        />

                        <Text style={{fontSize: 16}}>Powtórz nowe hasło</Text>
                        <TextInput
                            onChangeText={handleChange('repeatNewPassword')}
                            onBlur={handleBlur('repeatNewPassword')}
                            value={values.repeatNewPassword}
                            style={stylesMyProfileTextInput}
                            placeholder="Powtórz nowe hasło"
                            secureTextEntry={true}
                        />

                        <Text style={{color: 'red', textAlign: 'center', marginTop: 5}}>{message}</Text>

                        <TouchableOpacity style={[stylesMyProfileButton, {marginTop: 10}]} onPress={handleSubmit}>
                            <Text style={{fontSize: 20, fontWeight: "600"}}>Zapisz</Text>
                        </TouchableOpacity>
                </View>
            )}
        </Formik>
            

        </View>
    )
}

export default MyProfileScreen;