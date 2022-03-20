import React from 'react';
import { View, Text, Image} from 'react-native';
import {stylesAnnouncements} from './styles';

const AnnouncementView = ({ route, navigation }) => {

    //Przekazywane jest cale ogloszenie, w parametrzze 'announcement'

    return(
        
        <View style={stylesAnnouncements.announcementContainer}>

            <Text style={stylesAnnouncements.announcementTitle}>
                {route.params.announcement.category}
            </Text>
            
            <Text style={stylesAnnouncements.announcementTitle}>
                {route.params.announcement.title}
            </Text>

            <Image style={stylesAnnouncements.announcementPhoto} source={{uri: 'http://'+adresSerwera+':2400/anons/photo?name=' + route.params.announcement.image}}/>

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