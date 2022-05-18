import React, { useState, useContext } from "react";
import { SafeAreaView, View, FlatList, Text } from "react-native";
import {
  stylesHome,
  stylesAnnouncements,
  announcementAddButton,
  stylesNotificationList,
  SubTitle,
  ExtraView,
  StyledInputLabel,
} from "../../components/styles";
import NotificationScreen from "./NotificationScreen";
import SplashScreen from "../SplashScreen";

const NotificationList = ({ navigation, route }) => {
  const [notificationsData, setNotificationsData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [anons_id] = useState(route.params.anons_id);

  React.useEffect(
    () => {
      const fetchNotificationsData = async (id) => {
        setLoading(true);
        let url = "http://" + serwer + "/anons/notifications?id=" + id;
        setLoading(true);
        try {
          const response = await fetch(url, {
            method: "GET",
            credentials: "include",
          });
          const json = await response.json();
          setNotificationsData(json);
          setLoading(false);
          console.log(notificationsData);
        } catch (error) {
          setLoading(false);
          console.log("error", error);
        }
        setLoading(false);
      };
      fetchNotificationsData(anons_id);
    },
    [route.params],
    [notificationsData]
  );

  const Notification = ({ image, lat, lng, create_date }) => (
    <View style={stylesNotificationList.NotificationListItem}>
      <SubTitle notification={true}>{create_date}</SubTitle>
      <NotificationScreen lat={lat} lng={lng} image={image} />
    </View>
  );

  // Ta funkcja renderuje notyfikacje - jest wywolywana dla kazdego elementu (item) na liscie
  const renderItem = ({ item }) => (
    <Notification
      id={item.id}
      image={item.image}
      lat={item.lat}
      lng={item.lng}
      create_date={item.create_date}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SubTitle notificationTitle={true}>Powiadomienia</SubTitle>
        {isLoading ? (
          <SplashScreen />
        ) : notificationsData != "" ? (
          <SafeAreaView style={{ flex: 1 }}>
            <FlatList
              data={notificationsData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
            />
          </SafeAreaView>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 20 }}>Brak notyfikacji</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default NotificationList;
