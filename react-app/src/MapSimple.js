import './map.css';

import React from 'react';
import { MapContainer, TileLayer, Marker, LayerGroup, Popup } from 'react-leaflet';

import MapAnnouncementPopup from './MapAnnouncementPopup';

/*
    Mapa wyswietlajaca jedna lub wiecej lokalizacji.
*/

function LocationMarker(props) {
    let marker_key = 0;
    const markers = props.tab.map((loc) =>
        <Marker position = {[loc.lat, loc.lng]} key={marker_key++}>
            <Popup>
                <MapAnnouncementPopup />
            </Popup>
        </Marker>
    );
    return (
        <LayerGroup>
            {markers}
        </LayerGroup>
    )
}

export default function MapSimple(props) {
    return (
        <MapContainer className="map_simple" center={[52.25, 19.35]} zoom={5}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker tab = {props.tab} />
        </MapContainer>
    )
}