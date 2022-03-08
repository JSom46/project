//import 'leaflet/dist/leaflet.css';
import './map.css';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import MapAnnouncementPopup from './MapAnnouncementPopup';

/*
    Mapa wyswietlajaca wszystkie wczytane ogloszenia.
*/

function MarkerPlacer(props) {
    /*const [data, setData] = useState([]);
    const [updateData, setUpdateData] = useState(0);

    const map = useMap();
    //map.whenReady();

    useEffect(() => {
        setUpdateData(props.updateData);
    }, [props.updateData]);*/

    let json = [];
    //let images = [];
    if (props.useTestData) {
        let testdata = [];
        testdata.push({
            id: 1,
            title: "Test 1",
            description: "Przykladowe ogloszenie nr 1",
            category: 0,
            images: [],
            author_id: 453,
            create_date: "TODO data",
            lat: 50.222,
            lng: 20.545
        });
        testdata.push({
            id: 2,
            title: "Test 2",
            description: "Przykladowe ogloszenie nr 2",
            category: 0,
            images: [],
            author_id: 453,
            create_date: "TODO data",
            lat: 53.222,
            lng: 21.545
        });
        testdata.push({
            id: 3,
            title: "Test 3",
            description: "Przykladowe ogloszenie nr dsafdjbgfsdkjbgfsdkfnksdjfnsdjkn fgnfjgnf fmgnfmngfmgnfmgn kdnfsdfn kdnfm,dnfn fkngfmgn mnfgmfng",
            category: 0,
            images: [],
            author_id: 453,
            create_date: "TODO data",
            lat: 53.20,
            lng: 19.549
        });
        json = testdata;
    }
    else {
        if (props.data != undefined) {
            json = props.data;
        }
    }
    
    const markers = json.map((anon) =>
        <Marker position={[anon.lat, anon.lng]} key={anon.id}>
            <Popup>
                <MapAnnouncementPopup anon={anon} />
            </Popup>
        </Marker>
    );

    return (
        <MarkerClusterGroup>
            {markers}
        </MarkerClusterGroup>
    )
}

export default function MapOverview(props) {
    const [markersData, setMarkersData] = useState([]);
    const [updateData, setUpdateData] = useState(0);

    //TODO pobieranie danych powinno miec miejsce na wyzszym poziomie i dane powinny byc przekazywane do mapy i listy
    useEffect(async () => {
        //let tmp = [];
        let json_list = [];
        const fetchData = async () => {
            //let pageToFetch = 1;
            //let url_list = 'http://localhost:2400/anons/list?page=' + (pageToFetch);
            let url_list = 'http://localhost:2400/anons/list';
            try {
                const response_list = await fetch(url_list, {
                    method: 'GET',
                    credentials: 'include'
                });
                json_list = await response_list.json();
                /*const json_list = await response_list.json();
                console.log(json_list);
                json_list.list.forEach(async el => {
                    let url = 'http://localhost:2400/anons?id=' + el.id;
                    const response = await fetch(url, {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const json = await response.json();
                    tmp.push(json);
                });
                console.log("tmp");
                console.log(tmp);*/
                /*json_list.list.forEach(() => {
                    tmp.push(json_list.list);
                })*/
            }
            catch (error) {
                console.log("error", error);
            }
        }
        await fetchData();
        //console.log("settate");
        //console.log(tmp);
        setMarkersData(json_list.list);
        //if (updateMap == 0) setUpdateMap(updateMap + 1);
    }, [updateData]);

    function refreshData() {
        setUpdateData(updateData + 1);
    }

    return (
        <div id='mapController'>
            <MapContainer className="map_overview" center={[52.25, 19.35]} zoom={6}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MarkerPlacer data={markersData} useTestData={props.useTestData} updateData={updateData} />
            </MapContainer >
            <button onClick={refreshData}>Odswiez</button>
        </div>
    )
}