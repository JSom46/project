import React, {useState} from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import { stylesAnnouncements } from '../components/styles';
import SplashScreen from './SplashScreen';
import axios from 'axios';

//Przekazywane jest cale ogloszenie, w parametrzze 'announcement'

const AnnouncementView = ({ route, navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [announcement, setAnnouncement] = useState();
    const [date, setDate] = useState();
    

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
                  console.log("Pobrane ogloszenie: ",result);
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

        
    }, [])
      
    return(
        <View style={{flex: 1}}>
            {isLoading ? (
                <SplashScreen/>
            ) : (
                <ScrollView style={stylesAnnouncements.announcementContainer}>
                    <Text style={stylesAnnouncements.announcementTitle}>
                        {announcement.category == 0 ? "Zaginięcie" : "Znalezienie"}
                    </Text>
                    
                    <Text style={stylesAnnouncements.announcementTitle}>
                        {announcement.title}
                    </Text>

                    <Image style={stylesAnnouncements.announcementPhoto} source={{uri: 'http://' + serwer + '/anons/photo?name=' + announcement.images[0]}}/>

                    <Text style={{alignSelf: 'center'}}>
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
                            Opis: {announcement.description}
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => alert("jescze nie zaimplementowane")}
                        style={{
                            backgroundColor: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 5,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: 'black',
                            marginHorizontal: 20,
                            marginBottom: 20,
                        }}
                    >
                        <Text style={{fontSize: 20, fontWeight: "600"}}>Zobacz na mapie</Text>
                    </TouchableOpacity>

                </ScrollView>
            )}
        </View>
    )
}

export default AnnouncementView;