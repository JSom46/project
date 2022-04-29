import './map.css';

import React from 'react';
import { MapContainer, TileLayer, Marker, LayerGroup, Popup } from 'react-leaflet';

import MapAnnouncementPopup from './MapAnnouncementPopup';

/*
    Mapa wyswietlajaca jedna lokacje
*/

function LocationMarker(props) {
    let markers = null;
    if (props.loc !== undefined && props.loc !== null && props.loc.length === 2) {
        return (
            <Marker position={props.loc}>
                <Popup>
                    <MapAnnouncementPopup />
                </Popup>
            </Marker>
        );
    }
    return (
        <LayerGroup>
            {markers}
        </LayerGroup>
    )
}

export default function MapSimple(props) {
    let center = [52.25, 19.35];
    let zoom = 5;
    if (props.loc !== undefined && props.loc !== null && props.loc.length === 2) {
        center = props.loc;
        zoom = 11;
    }
    return (
        <MapContainer className="map_simple" center={center} zoom={zoom}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker loc={props.loc} />
        </MapContainer>
    )
}