import './map.css';

import React from 'react';
import { MapContainer, TileLayer, Marker, LayerGroup } from 'react-leaflet';
import L from 'leaflet';

/*
    Mapa wyswietlajaca jedna lokacje
*/

function LocationMarker(props) {
    let markers = null;
    const icon_found = new L.Icon({
        iconUrl: './marker-icon-found.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
    const icon_missing = new L.Icon.Default();
    if (props.loc !== undefined && props.loc !== null && props.loc.length === 2) {
        return (
            <Marker 
                position={props.loc} 
                icon={(props.useIconFound) ? icon_found : icon_missing}
            />
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
            <LocationMarker loc={props.loc} useIconFound={props.useIconFound}/>
        </MapContainer>
    )
}