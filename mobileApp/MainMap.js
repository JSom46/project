import React from 'react';
import MapView, { Marker, ProviderPropType } from 'react-native-maps';
import { UrlTile, PROVIDER_DEFAULT, MAP_TYPES } from 'react-native-maps';
import { StyleSheet } from "react-native"

function createData(id, title, category, image, lat, lng, type) {
    return { id, title, category, image, lat, lng, type, "coordinate": {"latitude": lat, "longitude": lng}};
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
        markers: [{"color": "#F00", "coordinate": {"latitude": 53.01666249150373, "longitude": 18.595575392246246}, "key": 0}], //do usuniecia
        count: 0,
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

        console.log(this.state.markers);
        console.log(this.state.announcements);
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
                //onPress={e => this.onMapPress(e)}
                //mapType={MAP_TYPES.NONE}
            >
                {this.state.markers.map(marker => (//do usuniecia
                    <Marker
                    key={marker.key}
                    coordinate={marker.coordinate}
                    pinColor="#F00"
                    />
                ))}
                {this.state.announcements.map(announcement => (
                    <Marker
                    key={announcement.id}
                    coordinate={announcement.coordinate}
                    pinColor="#00F"
                    />
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