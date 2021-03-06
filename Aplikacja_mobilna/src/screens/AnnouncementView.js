import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
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
import { userDataContext } from "./UserDataContext";

import SplashScreen from "./SplashScreen";

//Przekazywane jest cale ogloszenie, w parametrzze 'announcement'

const AnnouncementView = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

  //const [userData, setUserData] = useState(route.params.userData);
  const { userData, setUserData } = React.useContext(userDataContext);

  const [announcement, setAnnouncement] = useState();
  const [date, setDate] = useState();

  // React.useEffect(() => {
  //   setUserData(route.params.userData);
  // },[route.params.userData]);

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
      id: announcement.id,
    });
    var config = {
      method: "delete",
      url: "http://" + serwer + "/anons/",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      credentials: "same-origin",
    };
    axios(config)
      .then((response) => {
        try {
          const result = response.data;
          console.log("dostalem");
          console.log(result);
          if (response.status == "200") {
            console.log("usunieto ogloszenie");
            alert("Pomy??lnie usuni??to og??oszenie");
            setModalVisible(!isModalVisible);
            navigation.goBack();
          } else {
            console.log("nie udalo sie usunac ogloszenia");
            alert("Nie uda??o si?? usun???? og??oszenia");
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
          {userData.user_id === announcement.author_id ||
          userData.is_admin == 1 ? (
            <ButtonView>
              <TouchableOpacity
                style={announcementOptionsButton}
                onPress={() => {
                  navigation.navigate("EditAnnouncement", {
                    params: announcement,
                    photos: announcement.images,
                  });
                }}
              >
                <AntDesign name="edit" size={24} color="black" style={{marginRight: 10}}/>
                <Text style={{ fontSize: 18, color: "black" }}>Edytuj</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={announcementOptionsButton}
                onPress={toggleModal}
              >
                <Ionicons name="trash-outline" size={24} color="black" style={{marginRight: 10}}/>
                <Text style={{ fontSize: 18, color: "black" }}>Usu??</Text>
              </TouchableOpacity>

              <Modal
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => {
                  setModalVisible(!isModalVisible);
                }}
              >
                <View style={dialogContainer}>
                  <Text
                    style={{ fontSize: 24, color: "black", fontWeight: "bold" }}
                  >
                    Potwierd??
                  </Text>
                  <View style={innerDialogContainer}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: "black",
                        textAlign: "center",
                      }}
                    >
                      Czy na pewno chcesz usun???? to og??oszenie?
                    </Text>
                    <Text
                      style={{ fontSize: 18, color: "black", marginTop: 20 }}
                    >
                      {announcement.title}
                    </Text>
                    <Text style={{ fontSize: 14, color: "black" }}>
                      {date.toLocaleDateString("pl-PL")}
                    </Text>
                  </View>
                  <View style={innerDialogButtonsContainer}>
                    <TouchableOpacity
                      style={dialogButton}
                      onPress={toggleModal}
                    >
                      <Text style={{ fontSize: 18, color: "black" }}>
                        Anuluj
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        dialogButton,
                        {
                          backgroundColor: "red",
                          borderWidth: 1,
                          borderColor: "red",
                        },
                      ]}
                      onPress={handleDelete}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={24}
                        color={"white"}
                      />
                      <Text
                        style={{ fontSize: 18, color: "white", marginLeft: 5 }}
                      >
                        Tak
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </ButtonView>
          ) : (
            <></>
          )}
          <Text style={stylesAnnouncements.announcementTitle}>
            {announcement.category == 0 ? "Zagini??cie" : "Znalezienie"}
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
            Data zg??oszenia: {date.toLocaleDateString("pl-PL")}
          </Text>

          <View style={stylesAnnouncements.announcementDescriptionContainer}>
            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Rodzaj: {announcement.type}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Rasa: {announcement.breed}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Sier????: {announcement.coat}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              Kolor: {announcement.color}
            </Text>

            <Text style={stylesAnnouncements.announcementDescriptionText}>
              {announcement.description}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Mapa", {
                focusCoordinates: {
                  lat: announcement.lat,
                  lng: announcement.lng,
                },
              })
            }
            style={announcementViewButton}
          >
            <Text style={{ fontSize: 20, fontWeight: "600" }}>
              Zobacz na mapie
            </Text>
          </TouchableOpacity>

          {userData.user_id === "guestId" ? (
            <></>
          ) : (
            <>
              {userData.user_id === announcement.author_id ? (
                <></>
              ) : (
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
                      Widzia??em to zwierz??
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Wiadomo??ci", {
                        screen: "Lista rozm??w",
                        params: { createNewChat: announcement.id },
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
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AnnouncementView;
