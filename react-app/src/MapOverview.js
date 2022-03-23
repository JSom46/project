//import 'leaflet/dist/leaflet.css';
import './map.css';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';

//import './marker-icon-found.png';

/*
    Mapa wyswietlajaca wszystkie wczytane ogloszenia.
*/

function MapController(props) {

    const map = useMap();

    //console.log(new L.Icon.Default);
    const icon_found = new L.Icon({
        iconUrl: './marker-icon-found.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const icon_missing = new L.Icon.Default();
    //console.log(icon_found);

    function goToPos(pos, zoom) {
        map.flyTo(pos, zoom);
    }

    useEffect(() => {
        if (props.updateMap !== undefined && props.updateMap > 0 && props.goToPos !== undefined) {
            goToPos(props.goToPos, 14);
        }
    }, [props.updateMap]);
    
    const markers = props.data.map((anon) =>
        <Marker
            position={[anon.lat, anon.lng]}
            key={anon.id}
            eventHandlers={{ click: (e) => { props.handleMarkerClick(anon.id) } }}
            icon={(anon.category == 'Znalezienie') ? icon_found : icon_missing}
        />
    );
    //icon={(anon.category == 1) ? {url: './marker-icon-found.png'} : {}}
    return (
        <MarkerClusterGroup>
            {markers}
        </MarkerClusterGroup>
    )
}

export default function MapOverview(props) {
    return (
        <div id='mapController'>
            <MapContainer className="map_overview" center={props.center} zoom={props.zoom}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController
                    data={props.data}
                    handleMarkerClick={props.handleMarkerClick}
                    goToPos={props.goToPos}
                    updateMap={props.updateMap}
                />
            </MapContainer >
            {/*<button onClick={refreshData}>Odswiez</button>*/}
        </div>
    )
}