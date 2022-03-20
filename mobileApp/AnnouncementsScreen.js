import React ,{useState}from 'react';
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './SplashScreen';
import {stylesHome, stylesAnnouncements} from './styles';
import NotificationsScreen from './NotificationsScreen';
import AnnouncementsList from './AnnouncementsList';
import AnnouncementView from './AnnouncementView';


const AnnouncementsStack = createNativeStackNavigator();

// function createData(id, title, category, image, lat, lng, type) {
//     return { id, title, category, image, lat, lng, type };
// }
// async function getAnnouncements(){
//     try {
//         let response = await fetch('http://'+ adresSerwera +':2400/anons/list');
//         let json = await response.json();

//         let rows = [];

//         json.list.forEach(element => {
//             rows.push(createData(
//                 element.id,
//                 element.title,
//                 (element.category === 0 ? "Zaginięcie" : "Znalezienie"),
//                 element.image,
//                 element.lat,
//                 element.lng,
//                 element.type
//             ));
//         });
//         //console.log(rows);

//         return rows;
//       } catch (error) {
//          console.error(error);
//       }
// };

//   //Tak wyglada pojedyncze ogloszenie na liscie
//   const Announcement = ({ title, image, category }) => (
//     <View style={stylesAnnouncements.announcement}>
//       <Text style={stylesAnnouncements.announcementTitle}>{title}</Text>
//       <Text>{category}</Text>
//       <Text>{image}</Text>
//     </View>
//   );

const AnnouncementsScreen = ({ route, navigation }) => {

    //TO DO do renderItem dodac touchableopacity zeby na ogloszenie mozna bylo kliknac

    // const [isLoading, setLoading] = useState(true);
    // const [announcements, setAnnouncements] = useState([]);

    // React.useEffect(() => {
    //     getAnnouncements().then(rows => setAnnouncements(rows)).finally(() => setLoading(false));
    // }, []);

    //Ta funkcja renderuje ogloszenia - jest wywolywana dla kazdego elementu (item) na liscie
    // const renderItem = ({ item }) => (
    //     <TouchableOpacity
    //       //onPress wyswietl ogloszenie
    //     >
    //       <Announcement title={item.title} image={item.image} category={item.category}/>
    //     </TouchableOpacity>
    // );

    return(
      //<NavigationContainer>
        <AnnouncementsStack.Navigator screenOptions={{headerShown: false}}>
          <AnnouncementsStack.Screen name="Lista" component={AnnouncementsList} />
          <AnnouncementsStack.Screen name="Ogloszenie" component={AnnouncementView}/>
        </AnnouncementsStack.Navigator>
      //</NavigationContainer>
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