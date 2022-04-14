
//To jest ta moja wersja - Mikołaj

import React ,{useState}from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity, Image } from 'react-native';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from '../SplashScreen';
import {stylesHome, stylesAnnouncements} from '../../components/styles';

// do testow listy
// const DATA = [
//     {
//       id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
//       title: 'First Item',
//       description: 'opis 1',
//       category: '1',
//     },
//     {
//       id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
//       title: 'Second Item',
//       description: 'opis 2fdgdrhgdrgdgrdg drgdrgdgdfhtdfg rdg drgty5r  gghfghfghfghtfhd ghgft 55t',
//       category: '1',
//     },
//     {
//       id: '58694a0f-3da1-471f-bd96-145571e29d72',
//       title: 'Third Item',
//       description: 'opis 3',
//       category: '1',
//     },
//   ];

function createData(id, title, category, image, lat, lng, type, create_date) {
    return { id, title, category, image, lat, lng, type, create_date };
}


  //Tak wyglada pojedyncze ogloszenie na liscie, jest renderowane przez funkcje renderItem
  const Announcement = ({ title, image, category }) => (
    <View style={stylesAnnouncements.announcementListItem}>
      <Image style={stylesAnnouncements.announcementListItemPhoto} source={{uri: 'http://' + serwer + '/anons/photo?name=' + image}}/>
      <View style={{flex: 1}}>
        <Text style={stylesAnnouncements.announcementListItemTitle}>{title}</Text>
        <Text>{category}</Text>
      </View>
    </View>
  );

const AnnouncementsList = ({navigation, route}) => {

    const [isLoading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);
    const [pageCount, setPageCount] = useState(1);
    const isFocused = useIsFocused();

    async function getAnnouncements(){
      try {
          let page = pageCount;
          let response = await fetch('http://'+ serwer +'/anons/list?page=' + page + '&num=' + 20);
          //let response = await fetch('http://'+ serwer +'/anons/list');
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
          
          
          if(page == 1){
            setPageCount(page + 1);
          }
          return rows;
        } catch (error) {
           console.error(error);
        }
    };

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
                onPress={() => navigation.navigate('Dodaj Ogloszenie')}
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
          {isLoading ? <SplashScreen/> : (
            <SafeAreaView style={{flex: 1}}>
                <FlatList
                    data={announcements}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    onEndReached={() => {
                      //alert("prawei koniec");
                      getAnnouncements().then(rows => setAnnouncements(announcements.concat(rows))).finally(() => {
                        console.log("wczytano kolejna strone")
                        console.log(pageCount);
                        setPageCount(pageCount + 1);
                      });
                      
                    }}
                    onEndReachedThreshold={0.8}
                />
            </SafeAreaView>
          )}
        </View>
    );
}

export default AnnouncementsList;