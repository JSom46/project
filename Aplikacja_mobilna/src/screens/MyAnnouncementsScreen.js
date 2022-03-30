import React, {useState} from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, Image } from 'react-native';
import SplashScreen from './SplashScreen';
import {stylesHome, stylesAnnouncements} from '../components/styles';
import axios from "axios";
import { Button } from 'react-native-paper';

function createData(id, title, category, image, lat, lng, type, create_date) {
    return { id, title, category, image, lat, lng, type, create_date };
}

async function getAnnouncements(){
    try {
        let response = await fetch('http://'+ serwer +'/anons/my', {
            method: 'GET',
            credentials: 'include'
          });
          console.log(response);
        let json = await response.json();

        let rows = [];

        json.list.forEach(element => {
            rows.push(createData(
                element.id,
                element.title,
                (element.category === 0 ? "Zaginięcie" : "Znalezienie"),
                element.image,
                element.lat,
                element.lng,
                element.type,
                element.create_date,
            ));
            console.log(element);
        });
        //console.log(rows);

        return rows;
      } catch (error) {
         console.error(error);
      }
};

//Tak wyglada pojedyncze ogloszenie na liscie
const Announcement = ({ title, image, category }) => (
    <View style={stylesAnnouncements.announcementListItem}>
        <Image style={stylesAnnouncements.announcementListItemPhoto} source={{uri: 'http://' + serwer + '/anons/photo?name=' + image}}/>
        <View style={{flex: 1}}>
        <Text style={stylesAnnouncements.announcementListItemTitle}>{title}</Text>
        <Text>{category}</Text>
        </View>
    </View>
);

const MyAnnouncementsScreen = ({navigation}) => {
    const [isLoading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);

    React.useEffect(() => {
        getAnnouncements().then(rows => setAnnouncements(rows)).finally(() => setLoading(false));
    }, []);

    //Ta funkcja renderuje ogloszenia - jest wywolywana dla kazdego elementu (item) na liscie
    const renderItem = ({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Ogloszenie', {announcement: item})}  //onPress wyswietla konkretne ogloszenie - do Screena 'Ogloszenie' przekazywane jest cale ogloszenie w parametrze 'announcement'  
        >
          <Announcement title={item.title} image={item.image} category={item.category}/>
        </TouchableOpacity>
    );

    return(
        <View style={{flex: 1}}>
            <TouchableOpacity
                onPress={() => navigation.navigate('Dodaj Ogłoszenie')}
                style={{
                    backgroundColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 5,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'black',
                    marginHorizontal: 20,
                    marginVertical: 5,
                }}
            >
                <Text style={{fontSize: 20, fontWeight: "600"}}>Dodaj ogłoszenie</Text>
            </TouchableOpacity>
            
            <Text style={stylesHome.title}>
                Moje ogłoszenia:
            </Text>

            <View style={{flex: 1}}>
                {isLoading ? <SplashScreen/> : (
                    <SafeAreaView style={{flex: 1}}>
                        <FlatList
                            data={announcements}
                            keyExtractor={item => item.id}
                            renderItem={renderItem}
                        />
                    </SafeAreaView>
                )}
            </View>

        </View>
    )
}

export default MyAnnouncementsScreen;