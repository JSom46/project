import React, { useState } from "react";

import axios from "axios";
import {
  StyledContainer,
  StyledButton,
  ButtonText,
} from "../components/styles";

import MapView, { Permissions } from "react-native-maps";
import Constants from "expo-constants";
import * as Location from "expo-location";
import AddAnnouncement from "./Map/AddAnnouncement";
import AnnouncementList from "./Map/AnnouncementList";
import MapMain from "./Map/MapMain";

const Welcome = ({ navigation }) => {
  const handleLogout = (credentials) => {
    console.log(credentials);
    const url = "http://" + serwer + "/auth/logout";

    axios
      .get(url, credentials)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        if (response.status == "200") {
          navigation.navigate("Login");
        }
      })
      .catch((error) => {
        console.log(error.JSON());
      });
  };

  const handleLoggedIn = () => {
    const url = "http://" + serwer + "/auth/loggedin";

    const a = axios
      .get(url)
      .then((response) => {
        const result = response.data;
        const { message, status, data } = result;
        if (response.status == "200") {
          handleLogout(result.email);
        }
      })
      .catch((error) => {
        console.log(error.JSON());
      });
  };

  return (
    <StyledContainer>
      <StyledButton welcome={true} onPress={() => handleLoggedIn()}>
        <ButtonText>Wyloguj</ButtonText>
      </StyledButton>

      <StyledButton
        welcome={true}
        onPress={() => navigation.navigate("AddAnnouncement")}
      >
        <ButtonText>Dodaj ogloszenie</ButtonText>
      </StyledButton>

      <StyledButton
        welcome={true}
        onPress={() => navigation.navigate("MapMain")}
      >
        <ButtonText>Mapa</ButtonText>
      </StyledButton>

      <StyledButton
        welcome={true}
        onPress={() => navigation.navigate("AnnouncementList")}
      >
        <ButtonText>Lista</ButtonText>
      </StyledButton>
    </StyledContainer>
  );
};

export default Welcome;
