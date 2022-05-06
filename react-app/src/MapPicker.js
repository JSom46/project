import './map.css';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';

function LocationMarker(props) {
    const location = props.location;
    const map = useMap();

    const alwaysLocate = false; //set to true to always ask for location

    function handleLocationChange(loc) {
        props.onLocationChange(loc);
    }

    useMapEvents({
        click(e) {
            console.log(e.latlng);
            handleLocationChange(e.latlng);
        }
    });

    useEffect(() => {
        if (props.location !== undefined && props.location !== null) {
            map.setView(props.location, 13);
        }
    }, []);

    useEffect(() => {
        if (alwaysLocate || props.autoLocate || (props.locateMe !== undefined && props.locateMe > 0)) {
            map.locate({setView: true});
        }
    }, [props.locateMe]);

    return (
        (location == null) ? null : <Marker position={location} />
    );
}

export default function MapPicker(props) {
    const location = props.location;

    function handleLocationChange(loc) {
        props.onLocationChange(loc);
    }

    return(
        <MapContainer className="map_picker" center={[52.25, 19.35]} zoom={5}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker 
                location={location} 
                onLocationChange={handleLocationChange} 
                locateMe={props.locateMe} 
                autoLocate={props.autoLocate}
            />
        </MapContainer >
    )
}