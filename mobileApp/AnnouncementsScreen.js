import React ,{useState}from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import SplashScreen from './SplashScreen';
import {stylesHome, stylesAnnouncements} from './styles';

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

function createData(id, title, category, image, lat, lng, type) {
    return { id, title, category, image, lat, lng, type };
}
async function getAnnouncements(){
    try {
        let response = await fetch('http://'+ adresSerwera +':2400/anons/list');
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
                element.type
            ));
        });
        //console.log(rows);

        return rows;
      } catch (error) {
         console.error(error);
      }
};

  //Tak wyglada pojedyncze ogloszenie na liscie
  const Announcement = ({ title, image, category }) => (
    <View style={stylesAnnouncements.announcement}>
      <Text style={stylesAnnouncements.announcementTitle}>{title}</Text>
      <Text>{category}</Text>
      <Text>{image}</Text>
    </View>
  );

const AnnouncementsScreen = ({ route, navigation }) => {

    //TO DO do renderItem dodac touchableopacity zeby na ogloszenie mozna bylo kliknac

    const [isLoading, setLoading] = useState(true);
    const [announcements, setAnnouncements] = useState([]);

    React.useEffect(() => {
        getAnnouncements().then(rows => setAnnouncements(rows)).finally(() => setLoading(false));
    }, []);

    //Ta funkcja renderuje ogloszenia - jest wywolywana dla kazdego elementu (item) na liscie
    const renderItem = ({ item }) => (
        <Announcement title={item.title} image={item.image} category={item.category}/>
    );

    return(
        <View style={{flex: 1}}>
          {isLoading ? <SplashScreen/> : (
            <SafeAreaView style={{flex: 1, marginTop: StatusBar.currentHeight || 0}}>
                <FlatList
                    data={announcements}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
          )}
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       marginTop: StatusBar.currentHeight || 0,
//     },
//     item: {
//       backgroundColor: '#f9c2ff',
//       padding: 20,
//       marginVertical: 8,
//       marginHorizontal: 16,
//     },
//     title: {
//       fontSize: 32,
//     },
//   });

export default AnnouncementsScreen;