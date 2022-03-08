import React, { useState, useEffect } from 'react';
import MapOverview from './MapOverview';
import MapPicker from './MapPicker';
import MapSimple from './MapSimple';

export default function MapTesting() {
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [location, setLocation] = useState(null);

    /*const [markersData, setMarkersData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            let pageToFetch = 1;
            let url_list = 'http://localhost:2400/anons/list?page=' + (pageToFetch);
            try {
                const response_list = await fetch(url_list, {
                    method: 'GET',
                    credentials: 'include'
                });
                const json_list = await response_list.json();
                //console.log(json_list);
                const tmp = [];
                json_list.list.forEach(async el => {
                    let url = 'http://localhost:2400/anons?id=' + el.id;
                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const json = await response.json();
                    tmp.push(json);
                });
                //console.log(tmp);

                setMarkersData(tmp);
            }
            catch (error) {
                console.log("error", error);
            }
        }
        fetchData();
    }, [count]);*/

    function handleLocationChange(loc) {
        setLocation(loc);
        setLat(loc.lat);
        setLng(loc.lng);
    }

    function handleLatChange(e) {
        setLat(e.target.value);
        updateLocation();
    }

    function handleLngChange(e) {
        setLng(e.target.value);
        updateLocation();        
    }

    function updateLocation() {
        let latF = parseFloat(lat);
        let lngF = parseFloat(lng);
        if (!isNaN(latF) && !isNaN(lngF)) {
            setLocation([latF, lngF]);
        }
    }

    return (
        <div>
            <MapPicker location = {location} onLocationChange = {handleLocationChange} />
            <span>Lat: </span><input value = {lat} onChange = {handleLatChange} /><br />
            <span>Lng: </span><input value = {lng} onChange = {handleLngChange} />
            {/*<MapOverview data = {markersData} />*/}
            <MapOverview />
            <MapSimple tab = {[{lat: 53.222, lng: 21.545}, {lat: 50.222, lng: 26.545}]} />
        </div>
        
    )
}