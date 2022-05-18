import React, { useState, useEffect } from "react";
import { View } from "react-native";
//icon
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import * as Linking from "expo-linking";

import { Formik } from "formik";
import {
  StyledContainer,
  InnerContainer,
  PageTitle,
  SubTitle,
  StyledFormArea,
  RightIcon,
  StyledButton,
  StyledInputLabel,
  StyledTextInput,
  Colors,
  LeftIcon,
  ButtonText,
  MsgBox,
  Line,
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent,
  ButtonView,
  Logo,
} from "../../components/styles";
import { StatusBar } from "expo-status-bar";

import { userDataContext } from "../UserDataContext";

const { brand, darkLight, black, primary, facebook } = Colors;

//API client
import axios from "axios";

const Login = ({ navigation }) => {
  const [hidePassword, setHidedPassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();
  const { userData, setUserData } = React.useContext(userDataContext);

  // const {handleLogin} = React.useContext(AuthContext);
  // const {LoginGoogleFunc} = React.useContext(AuthContext);
  // const {LoginFacebookFunc} = React.useContext(AuthContext);
  // const {handleLogout} = React.useContext(AuthContext);
  //const {handleMessage} = React.useContext(AuthContext);

  // //sprawdzanie po wlaczeniu aplikacji czy uzytkownik jest zalogowany
  // React.useEffect(() => {
  //   const handleLoggedIn = () => {
  //   const url = "http://" + serwer + "/auth/loggedin";
  //   axios
  //     .get(url)
  //     .then((response) => {
  //       const result = response.data;
  //       console.log(result);
  //       const { message, status, data } = result;
  //       if (response.status == "200") {
  //         console.log(result.email)
  //         navigation.replace('Nawigator', {userData: result});
  //       }
  //       })

  //     .catch((error) => {
  //       //console.log(error);
  //       console.log("Nie jesteś zalogowany");
  //       navigation.replace('Nawigator', {userData: guestData});
  //     });
  //   };
  //     handleLoggedIn();
  // }, []);

  async function LoginGoogle() {
    const data = await fetch("http://" + serwer + "/auth/google/url", {
      method: "GET",
      credentials: "include",
    });
    return await data.json();
  }
  const LoginGoogleFunc = async (e) => {
    e.preventDefault();
    const response = await LoginGoogle();
    console.log(response.url);
    Linking.openURL(response.url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  async function LoginFacebook() {
    const data = await fetch("http://" + serwer + "/auth/facebook/url", {
      method: "GET",
      credentials: "include",
    });
    return await data.json();
  }
  const LoginFacebookFunc = async (e) => {
    e.preventDefault();
    const response = await LoginFacebook();
    console.log(response.url);
    Linking.openURL(response.url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  };

  const handleMessage = (message, type = "FALSE") => {
    setMessage(message);
    setMessageType(type);
  };
  const handleLogin = (credentials) => {
    handleMessage(null);
    let userData = {
      email: credentials.email,
      password: credentials.password,
    };
    console.log("xd");
    console.log(userData);
    var data = JSON.stringify({
      credentials,
      // email: "jarszy@loremipsummail.com",
      // email: "jarszy@loremipsummail.com",
      // password: "noweHaslo12",
      // email: "admin@trash-mail.com",
      // password: "admin",
    });
    var config = {
      method: "post",
      url: "http://" + serwer + "/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      //data: data,
      data: credentials,
      credentials: "same-origin",
    };
    console.log(config);
    console.log(data);
    axios(config)
      .then((response) => {
        try {
          const result = response.data;
          const { message, status, data } = result;
          console.log("dostalem");
          console.log(result);
          // console.log(response.status);
          if (response.status == "200") {
            console.log("zalogowano");
            console.log(result);
            setUserData(result);
            navigation.replace("Nawigator", { userData: result });
          } else {
            console.log("nie zalogowano");
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error.response.data.msg);
        if (error.response.data.msg == "account not active") {
          handleMessage("Konto nieaktywne");
        } else handleMessage("Podany email i/lub hasło są nieprawidłowe.");
      });
  };

  const handleLogout = (credentials) => {
    const url = "http://" + serwer + "/auth/logout";

    axios
      .get(url)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        if (response.status == "200") {
          console.log("wylogowano");
        }
      })
      .catch((error) => {
        //setSubmitting(false);
        console.log(error.response);
      });
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <Logo source={require("./../../../assets/logomk2.png")} />
        <PageTitle>Zwierzoznajdźca</PageTitle>
        <SubTitle>Logowanie</SubTitle>

        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => {
            // console.log(JSON.stringify(values));
            handleLogin(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <StyledFormArea>
              <MyTextInput
                label="Adres email"
                icon="mail"
                placeholder="email"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                // keyboardType="email.address"
              />

              <MyTextInput
                label="Hasło"
                icon="lock"
                placeholder="* * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidedPassword={setHidedPassword}
              />
              <MsgBox type={messageType}>{message}</MsgBox>
              <StyledButton onPress={handleSubmit}>
                <ButtonText>Logowanie</ButtonText>
              </StyledButton>
              <ExtraView>
                <ExtraText>albo Loguj z</ExtraText>
              </ExtraView>
              <ButtonView>
                <StyledButton google={true} onPress={LoginGoogleFunc}>
                  <Fontisto name="google" color={primary} size={20} />
                  <ButtonText google={true}>Google</ButtonText>
                </StyledButton>
                <StyledButton facebook={true} onPress={LoginFacebookFunc}>
                  <Fontisto name="facebook" color={primary} size={20} />
                  <ButtonText facebook={true}>Facebook</ButtonText>
                </StyledButton>
              </ButtonView>
              <ExtraView>
                <ExtraText>Nie masz jeszcze konta?</ExtraText>
                <TextLink onPress={() => navigation.navigate("Register")}>
                  <TextLinkContent>Zarejestruj</TextLinkContent>
                </TextLink>
              </ExtraView>

              {/* <ExtraView>
                <ButtonView>
                  <StyledButton onPress={handleLogout}>
                    <ButtonText>Logout</ButtonText>
                  </StyledButton>
                </ButtonView>
              </ExtraView> */}
            </StyledFormArea>
          )}
        </Formik>
      </InnerContainer>
    </StyledContainer>
  );
};

const MyTextInput = ({
  label,
  icon,
  isPassword,
  hidePassword,
  setHidedPassword,
  ...props
}) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={darkLight} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidedPassword(!hidePassword)}>
          <Ionicons
            name={hidePassword ? "md-eye-off" : "md-eye"}
            size={30}
            color={black}
          />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
