//import 'leaflet/dist/leaflet.css';
import './map.css';

import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function LocationMarker(props) {
    //const [location, setLocation] = useState(null);
    const location = props.location;

    function handleLocationChange(loc) {
        props.onLocationChange(loc);
    }

    const mapEvents = useMapEvents({
        click(e) {
            console.log(e.latlng);
            //setLocation(e.latlng);
            //handleLocationChange(e.latlng.wrap());
            handleLocationChange(e.latlng);
        }
    });
    if (location == null) {
        return null;
    }
    else {
        return (
            <Marker position = {location}></Marker>
        )
    }
}

//const mapBounds = [[90, -180], [-90, 180]];
const mapBounds = null;

export default function MapPicker(props) {
    const location = props.location;

    function handleLocationChange(loc) {
        props.onLocationChange(loc);
    }

    return(
        <MapContainer className="map_picker" center={[52.25, 19.35]} zoom={5} maxBounds={mapBounds}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker location={location} onLocationChange={handleLocationChange} />
        </MapContainer >
    )
}