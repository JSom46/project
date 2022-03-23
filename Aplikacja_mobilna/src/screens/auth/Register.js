import React, { useState } from "react";
import { View } from "react-native";
//icon
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";

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
} from "../../components/styles";
import { StatusBar } from "expo-status-bar";

//API client
import axios from "axios";

const { brand, darkLight, black, primary } = Colors;

const Register = ({ navigation }) => {
  const [hidePassword, setHidedPassword] = useState(true);
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();

  async function handleSignup(credentials) {
    handleMessage(null);

    const url = "http://" + serwer + "/auth/signup";

    await axios
      .post(url, credentials)
      .then((response) => {
        console.log("dostalem");
        console.log(response.status);
        handleMessage("Pomyslnie zalozono konto", true);
      })
      .catch((err) => {
        //  console.log(JSON.stringify(err.response.data));
        if (err.response.status == 400) {
          handleMessage("email jest zajęty");
        } else handleMessage("blad sieci");
      });
  }
  const handleMessage = (message, type = "FALSE") => {
    setMessage(message);
    setMessageType(type);
  };

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageTitle>Nazwa</PageTitle>
        <SubTitle>Rejestracja</SubTitle>

        <Formik
          initialValues={{
            login: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) => {
            if (
              values.email == "" ||
              values.password == "" ||
              values.login == "" ||
              values.confirmPassword == ""
            ) {
              handleMessage("Uzupelnij wszystkie pola");
            } else if (values.password != values.confirmPassword) {
              handleMessage("Hasla nie sa takie same");
            } else if (values.password.length < 8) {
              handleMessage("Haslo powinno zawierac conajmniej 8 znakow");
            } else if (hasCapitalLetter(values.password)) {
              handleMessage(
                "Haslo powinno zawierac conajmniej 1 wielka litere"
              );
            } else if (hasNumber(values.password)) {
              handleMessage("Haslo powinno zawierac conajmniej 2 cyfry");
            } else {
              handleSignup(values);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            isSubmitting,
          }) => (
            <StyledFormArea>
              <MyTextInput
                label="Login"
                icon="person"
                placeholder="login"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("login")}
                onBlur={handleBlur("login")}
                value={values.login}
                // keyboardType="email.address"
              />

              <MyTextInput
                label="Email Address"
                icon="mail"
                placeholder="email"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                // keyboardType="email.address"
              />

              <MyTextInput
                label="Password"
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

              <MyTextInput
                label="Confirm Password"
                icon="lock"
                placeholder="* * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange("confirmPassword")}
                onBlur={handleBlur("confirmPassword")}
                value={values.confirmPassword}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidedPassword={setHidedPassword}
              />

              <MsgBox type={messageType}>{message}</MsgBox>

              <StyledButton onPress={handleSubmit}>
                <ButtonText>Rejestruj</ButtonText>
              </StyledButton>

              <Line />
              <ExtraView>
                <ExtraText>Masz juz konto?</ExtraText>
                <TextLink onPress={() => navigation.navigate("Login")}>
                  <TextLinkContent>Loguj</TextLinkContent>
                </TextLink>
              </ExtraView>
              <ExtraView>
                <ExtraText>Chcesz aktywowac konto?</ExtraText>
                <TextLink onPress={() => navigation.navigate("Activation")}>
                  <TextLinkContent>Aktywuj konto</TextLinkContent>
                </TextLink>
              </ExtraView>
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

function hasCapitalLetter(word) {
  for (var i = 0; i < word.length; i++) {
    if (word[i].charCodeAt() > 64 && word[i].charCodeAt() < 91) {
      return false;
    }
  }
  return true;
}

function hasNumber(word) {
  var t = 0;
  for (var i = 0; i < word.length; i++) {
    if (!isNaN(word[i])) {
      t++;
    }
  }
  if (t < 2) {
    return true;
  } else return false;
}

export default Register;
