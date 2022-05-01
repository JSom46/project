import React, { useState } from "react";
import {View, Text, Image, ScrollView, TouchableOpacity, Modal, Button } from "react-native";
import {
  stylesAnnouncements, 
  ButtonView, 
  announcementOptionsButton, 
  dialogContainer, 
  innerDialogContainer, 
  innerDialogButtonsContainer, 
  dialogButton,
  announcementViewButton,
} from "../components/styles";
import {
  Octicons,
  Ionicons,
  Fontisto,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import axios from "axios";
import Swiper from "react-native-swiper";

import SplashScreen from "./SplashScreen";

//Przekazywane jest cale ogloszenie, w parametrzze 'announcement'

const AnnouncementView = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  const [userData, setUserData] = useState(route.params.userData);
  const [announcement, setAnnouncement] = useState();
  const [date, setDate] = useState();

  React.useEffect(() => {
    setUserData(route.params.userData);
  },[route.params.userData]);

  //pobieranie szczegolowych informacji o ogloszeniu
  React.useEffect(() => {
    const getAnnouncement = (announcementId) => {
      console.log(announcementId);
      const url = "http://" + serwer + "/anons/?id=" + announcementId;

      axios
        .get(url)
        .then((response) => {
          const result = response.data;
          if (response.status == "200") {
            console.log("Pobrane ogloszenie: ", result);
            setAnnouncement(result);
            let tempDate = new Date(result.create_date * 1000);
            setDate(tempDate);
          }
        })
        .catch((error) => {
          console.log(error.JSON());
          setIsLoading(true);
        })
        .finally(() => setIsLoading(false));
    };

    getAnnouncement(route.params.announcement.id);
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleDelete = () => {
    var data = JSON.stringify({
      id: announcement.id
    });
    var config = {
      method: "delete",
      url: "http://" + serwer + "/anons/",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      credentials: 'same-origin',
    };
    axios(config)
      .then((response) => {
        try {
          const result = response.data;
          console.log("dostalem");
          console.log(result);
          if (response.status == "200") {
            console.log("usunieto ogloszenie");
            alert("Pomyślnie usunięto ogłoszenie");
            setModalVisible(!isModalVisible);
            navigation.goBack();
          } else {
            console.log("nie udalo sie usunac ogloszenia");
            alert("Nie udało się usunąć ogłoszenia");
            setModalVisible(!isModalVisible);
          }
        } catch (error) {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error.response.data.msg);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <SplashScreen />
      ) : (
        <ScrollView style={stylesAnnouncements.announcementContainer}>
          {userData.user_id === announcement.author_id || userData.is_admin == 1 ? (
            <ButtonView>
            <TouchableOpacity style={announcementOptionsButton} onPress={() => alert("Jak bedzie w pełni dzialajace dodawanie to przerobi się je też na modyfikowanie")}>
              <Text style={{ fontSize: 18, color: "black" }}>
                Edytuj
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={announcementOptionsButton} onPress={toggleModal}>
              <Text style={{ fontSize: 18, color: "black" }}>
                Usuń
              </Text>
            </TouchableOpacity>

            <Modal visible={isModalVisible} transparent={true} onRequestClose={() => {setModalVisible(!isModalVisible)}}>
              <View style={dialogContainer}>
                <Text style={{ fontSize: 24, color: "black", fontWeight: "bold"}}>Potwierdź</Text>
                <View style={innerDialogContainer}>
                  <Text style={{ fontSize: 18, color: "black", textAlign: "center" }}>Czy na pewno chcesz usunąć to ogłoszenie?</Text>
                  <Text style={{ fontSize: 18, color: "black", marginTop: 20}}>{announcement.title}</Text>
                  <Text style={{ fontSize: 14, color: "black"}}>{date.toLocaleDateString("pl-PL")}</Text>
                </View>
                <View style={innerDialogButtonsContainer}>
                  <TouchableOpacity style={dialogButton} onPress={toggleModal}>
                    <Text style={{ fontSize: 18, color: "black" }}>
                      Anuluj
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[dialogButton, {backgroundColor: "red", borderWidth: 1, borderColor: "red"}]} onPress={handleDelete}>
                    <Ionicons
                      name="trash-outline"
                      size={24}
                      color={"white"}
                    />
                    <Text style={{ fontSize: 18, color: "white", marginLeft: 5 }}>
                      Tak
                    </Text>
                    
                  </TouchableOpacity>
                </View>
                
              </View>
          </Modal>
          </ButtonView>
          ):(
            <></>
          )}
          <Text style={stylesAnnouncements.announcementTitle}>
            {announcement.category == 0 ? "Zaginięcie" : "Znalezienie"}
          </Text>

          <Text style={stylesAnnouncements.announcementTitle}>
            {announcement.title}
          </Text>

          {/* <Image style={stylesAnnouncements.announcementPhoto} source={{uri: 'http://' + serwer + '/anons/photo?name=' + announcement.images[0]}}/> */}
          <Swiper height={310} showsButtons={true} loop={false}>
            {announcement.images.map((item, key) => {
              return (
                <View
                  key={key}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <Image
                    style={stylesAnnouncements.announcementPhoto}
                    source={{
                      uri: "http://" + serwer + "/anons/photo?name=" + item,
                    }}
                  />
                </View>
              );
            })}
          </Swiper>

          <Text style={{ alignSelf: "center" }}>
            Data zgłoszenia: {date.toLocaleDateString("pl-PL")}
          </Text>

          <View style={stylesAnnouncements.announcementDescriptionContainer}>
            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Rodzaj: {announcement.type}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Rasa: {announcement.breed}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Sierść: {announcement.coat}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Kolor: {announcement.color}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              {announcement.description}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("Mapa", {
              focusCoordinates: {
                lat: announcement.lat,
                lng: announcement.lng
              }
            })}
            style={announcementViewButton}
          >
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              Zobacz na mapie
            </Text>
          </TouchableOpacity>

          {userData.user_id === "guestId" ? (
            <></>
          ):(
            <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddNotification", {
                  anons_id: announcement.id,
                  photos: "",
                });
              }}
              style={announcementViewButton}
            >
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                Widziałem to zwierzę
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Wiadomości", {
                  screen: 'Lista rozmów',
                  params: {createNewChat: announcement.id},
                });
              }}
              style={announcementViewButton}
            >
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                Czat
              </Text>
            </TouchableOpacity>
            </>
          )}

          
        </ScrollView>
      )}
    </View>
  );
};

export default AnnouncementView;
