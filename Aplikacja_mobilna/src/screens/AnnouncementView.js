import React from 'react';
import { View, Text, Image} from 'react-native';
import { stylesAnnouncements } from '../components/styles';

const AnnouncementView = ({ route, navigation }) => {

    //Przekazywane jest cale ogloszenie, w parametrzze 'announcement'
    //jesli ogloszenia wczytujemy jako obiekty - tak jak ja to zrobilem to nie trzeba tu nic zmieniac
    //ale jesli wczytujemy, tak jak Ty masz - tzn. ogloszenie jako tablica to trzeba pozmieniac z announcement.XYZ na announcement[ABC]

    return(
        
        <View style={stylesAnnouncements.announcementContainer}>

            <Text style={stylesAnnouncements.announcementTitle}>
                {route.params.announcement.category}
            </Text>
            
            <Text style={stylesAnnouncements.announcementTitle}>
                {route.params.announcement.title}
            </Text>

            <Image style={stylesAnnouncements.announcementPhoto} source={{uri: 'http://' + serwer + '/anons/photo?name=' + route.params.announcement.image}}/>

            <Text>
                Typ: {route.params.announcement.type}
            </Text>

            <Text>
                Data: {route.params.announcement.create_date}
            </Text>

            <Text>
                Pozostale informacje o ogloszeniu.
            </Text>

        </View>
    )
}

export default AnnouncementView;