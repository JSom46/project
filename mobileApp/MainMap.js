import React from 'react';
import MapView, { Marker, ProviderPropType, Callout, CalloutSubview} from 'react-native-maps';
import { UrlTile, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';
import { StyleSheet, Text, View, Image} from "react-native"
import { useNavigation } from '@react-navigation/native';
import {Svg, Image as ImageSvg} from 'react-native-svg';
import { stylesMap } from './styles';

function createData(id, title, category, image, lat, lng, type, create_date) {
    return { id, title, category, image, lat, lng, type, "coordinate": {"latitude": lat, "longitude": lng}, create_date};
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
                element.type,
                element.create_date,
            ));
        });
        //console.log(rows);

        return rows;
      } catch (error) {
         console.error(error);
      }
};

class MainMap extends React.Component {
    state = {
        isLoading: true,
        announcements: [],
    }

    // onMapPress(e) {
    //     this.setState({
    //       markers: [
    //         ...this.state.markers,
    //         {
    //           coordinate: e.nativeEvent.coordinate,
    //           key: ++this.state.count,
    //           color: '#F00',
    //         },
    //       ],
    //     });
    // }
    
    componentDidMount() {
        getAnnouncements().then(rows => this.setState({announcements: rows})).finally(() => this.setState({isLoading: false}));
        //console.log(this.state.announcements);
    }

    render(){
        const { navigation } = this.props;

        //console.log(this.state.announcements);

        return(
            <MapView
                initialRegion={{
                    latitude: 53.022222,
                    longitude: 18.611111,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                style={{
                    ...StyleSheet.absoluteFillObject,
                }}
                //mapType={MAP_TYPES.NONE}
            >
                
                {/*do usuniecia - testowy znacznik z wpisanymi na sztywno danymi*/}
                {/* <Marker
                    key={0}
                    coordinate={{"latitude": 53.01666249150373, "longitude": 18.595575392246246}}
                    pinColor="#F00"
                /> */}

                {this.state.announcements.map(announcement => (
                    <Marker
                    key={announcement.id}
                    coordinate={announcement.coordinate}
                    pinColor="#00F"
                    >
                        <Callout
                            style={stylesMap.callout}
                            onPress={() => navigation.navigate('Ogloszenie', {announcement: announcement})}
                        >
                            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                                <Text style={stylesMap.calloutTitle}>{announcement.title}</Text>
                                {/* <Text style={{height: 150, position: 'relative', bottom: 20, textAlign: 'center'}}>
                                    <Image style={{width: 80, height: 80,}} source={{uri: 'http://'+adresSerwera+':2400/anons/photo?name=' + announcement.image}}/>
                                    <Image style={{width: 80, height: 80,}} source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}/>
                                </Text> */}
                                <Svg width={120} height={120}>
                                    <ImageSvg
                                        width={'100%'} 
                                        height={'100%'}
                                        preserveAspectRatio="xMidYMid slice"
                                        href={{ uri: 'http://'+adresSerwera+':2400/anons/photo?name=' + announcement.image}}
                                    />
                                </Svg>
                            </View>
                        </Callout>
                    </Marker>
                ))}
                    
                <UrlTile
                    /**
                     * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
                     * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
                     */
                    urlTemplate="https://a.tile.openstreetmap.com/{z}/{x}/{y}.png"
                    flipY={false}
                    shouldReplaceMapContent={true}
                />
            </MapView>
        )
    }
}

export default MainMap;


// 'http://'+adresSerwera+':2400/anons/photo?name=' + announcement.image