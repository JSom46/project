import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import SplashScreen from "./SplashScreen";
import { stylesHome, stylesAnnouncements } from "../components/styles";
import axios from "axios";
import { useFocusEffect, useLinkProps } from "@react-navigation/native";
import { Button } from "react-native-paper";
import { userDataContext } from "./UserDataContext";

import { Badge } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

function createData(
  id,
  title,
  category,
  image,
  lat,
  lng,
  type,
  create_date,
  notifications_count
) {
  return {
    id,
    title,
    category,
    image,
    lat,
    lng,
    type,
    create_date,
    notifications_count,
  };
}

async function getAnnouncements() {
  try {
    let response = await fetch("http://" + serwer + "/anons/my", {
      method: "GET",
      credentials: "include",
    });
    //console.log(response);
    let json = await response.json();

    let rows = [];

    json.list.forEach((element) => {
      rows.push(
        createData(
          element.id,
          element.title,
          element.category === 0 ? "Zaginięcie" : "Znalezienie",
          element.image,
          element.lat,
          element.lng,
          element.type,
          element.create_date,
          element.notifications_count
        )
      );
      //console.log(element);
    });
    console.log(rows);

    return rows;
  } catch (error) {
    console.error(error);
  }
}

const MyAnnouncementsScreen = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  //const [userData, setUserData] = useState(route.params.userData);
  const { userData, setUserData } = React.useContext(userDataContext);

  const [refreshing, setRefreshing] = useState(false);

  //   React.useEffect(() => {
  //     getAnnouncements()
  //       .then((rows) => setAnnouncements(rows))
  //       .finally(() => setLoading(false));
  //     console.log(userData);
  //   }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAnnouncements()
        .then((rows) => setAnnouncements(rows))
        .finally(() => setLoading(false));
      console.log(userData);
    }, [navigation])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    //console.log(filterData);
    setAnnouncements([]);
    console.log("w odswiezaniu ");
    getAnnouncements()
      .then((rows) => setAnnouncements(rows))
      .finally(() => {
        setRefreshing(false);
      });
  }, [announcements]);

  //Tak wyglada pojedyncze ogloszenie na liscie
  const Announcement = ({
    id,
    title,
    image,
    category,
    notifications_count,
  }) => (
    <View style={stylesAnnouncements.announcementListItem}>
      <Image
        style={stylesAnnouncements.announcementListItemPhoto}
        source={{ uri: "http://" + serwer + "/anons/photo?name=" + image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={stylesAnnouncements.announcementListItemTitle}>
          {title}
        </Text>
        <Text>{category}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Powiadomienia", {
            anons_id: id,
          });
        }}
      >
        <Ionicons name="notifications" size={40} />
        {notifications_count != 0 ? (
          <Badge
            value={notifications_count}
            status="error"
            size={50}
            containerStyle={{ position: "absolute", top: -4, right: -4 }}
          />
        ) : null}
      </TouchableOpacity>
    </View>
  );

  //Ta funkcja renderuje ogloszenia - jest wywolywana dla kazdego elementu (item) na liscie
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Ogloszenie", {
          announcement: item,
          //userData: userData
        })
      } //onPress wyswietla konkretne ogloszenie - do Screena 'Ogloszenie' przekazywane jest cale ogloszenie w parametrze 'announcement'
    >
      <Announcement
        id={item.id}
        title={item.title}
        image={item.image}
        category={item.category}
        notifications_count={item.notifications_count}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* <TouchableOpacity
        onPress={() => navigation.navigate("Dodaj Ogloszenie")}
        style={{
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          padding: 5,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "black",
          marginHorizontal: 20,
          marginVertical: 5,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          Dodaj ogłoszenie
        </Text>
      </TouchableOpacity> */}

      <Text style={stylesHome.title}>Moje ogłoszenia:</Text>

      <View style={{ flex: 1 }}>
        {isLoading ? (
          <SplashScreen />
        ) : (
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={announcements}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </SafeAreaView>
        )}
      </View>
    </View>
  );
};

export default MyAnnouncementsScreen;
