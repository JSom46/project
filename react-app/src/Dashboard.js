import React, { useEffect, useState } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import DataGridList from './DataGridList';

import Grid from '@mui/material/Grid';

import MapOverview from './MapOverview';
import AnnouncementDialog from './AnnouncementDialog';
import FiltersDialog from './FiltersDialog';
import { Stack} from '@mui/material';



function createData(list) {
  if (list === undefined || list === null) return null;
  let rows = [];
  list.forEach(element => {
    rows.push({
      id: element.id,
      title: element.title,
      category: (element.category === 0 ? "Zaginięcie" : "Znalezienie"),
      type: element.type,
      image: process.env.REACT_APP_SERVER_ROOT_URL + "/anons/photo?name=" + element.image,
      create_date: element.create_date,
      lat: element.lat,
      lng: element.lng,
      distance: element.distance
    });
  });
  return rows;
}

function createFilters() {
  return {
    category: -1,
    anonTitle: '',
    type: '',
    coat: '',
    color: '',
    breed: '',
    location: null,
    rad: ''
  }
}

export default function Dashboard(props) {

  const [listData, setListData] = useState(null);
  const [updateListData, setUpdateListData] = useState(0);

  const [filters, setFilters] = useState(createFilters());
  const [filtersDialogOpen, setFiltersDialogOpen] = useState(false);
  const [showDistance, setShowDistance] = useState(false);

  const [announcementData, setAnnouncementData] = useState([]);
  const [announcementDialogOpen, setAnnouncementDialogOpen] = useState(false);

  const [mapCenter, setMapCenter] = useState([52.25, 19.35]);
  const [mapZoom, setMapZoom] = useState(6);
  const [goToPos, setGoToPos] = useState();
  const [updateMap, setUpdateMap] = useState(0);

  const urldata = useLocation();

  const chatRedirect = (id) => {
    props.chatRedirect(id);
  }

  //get map position from url params
  useEffect(() => {
    const params = new URLSearchParams(urldata.search);
    let lat = params.get("lat");
    let lng = params.get("lng");

    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      //setMapCenter([lat, lng]);
      //setMapZoom(14);
      setGoToPos([lat, lng]);
      setUpdateMap(updateMap + 1);
    }
  }, [0]);

  //fetch list data
  useEffect(async () => {
    let json = [];

    function addParam(arg, params) {
      let str = "";
      if (params === 0) {
        str += "?";
      }
      else {
        str += "&";
      }
      str += arg;
      return str;
    }

    const fetchData = async () => {
      let url = process.env.REACT_APP_SERVER_ROOT_URL + '/anons/list';

      //apply filters
      let params = 0;
      //console.log(filters);
      if (filters.category !== -1) {
        url += addParam("category=" + filters.category, params);
        params++;
      }
      if (filters.type !== '') {
        url += addParam("type=" + filters.type, params);
        params++;
      }
      if (filters.coat !== '') {
        url += addParam("coat=" + filters.coat, params);
        params++;
      }
      if (filters.color !== '') {
        url += addParam("color=" + filters.color, params);
        params++;
      }
      if (filters.breed !== '') {
        url += addParam("breed=" + filters.breed, params);
        params++;
      }
      if (filters.location !== null) {
        url += addParam("lat=" + filters.location.lat.toString(), params);
        params++;
      }
      if (filters.location !== null) {
        url += addParam("lng=" + filters.location.lng.toString(), params);
        params++;
      }
      if (!isNaN(filters.rad) && filters.rad > 0) {
        url += addParam("rad=" + filters.rad, params);
        params++;
      }
      //console.log(url);

      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });
        json = await response.json();
      }
      catch (error) {
        console.log("error", error);
      }
    }
    await fetchData();
    setListData(createData(json.list));
  }, [updateListData]);

  //fetch announcement data
  const fetchAnnouncementData = async (id) => {
    let url = process.env.REACT_APP_SERVER_ROOT_URL + '/anons?id=' + id;
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });
      const json = await response.json();
      //console.log(url);
      setAnnouncementData(json);
    } catch (error) {
      console.log("error", error);
    }
  };

  function refreshData() {
    setAnnouncementData([]);
    setListData(null);
    setUpdateListData(updateListData + 1);
  }

  function openAnnouncementDialog(id) {
    setAnnouncementData([]);
    setAnnouncementDialogOpen(true);
    fetchAnnouncementData(id);
  }

  function showOnMap(lat, lng) {
    setAnnouncementDialogOpen(false);
    setGoToPos([lat, lng]);
    setUpdateMap(updateMap + 1);
  }

  function updateFilters(_filters) {
    setFilters(_filters);
    refreshData();
    //setUpdateListData(updateListData + 1);
  }

  function listDistance(val) {
    setShowDistance(val);
  }

  return (
    <BrowserRouter>
      <Grid container spacing={2} columns={16} sx={{px: '12px', py: '12px'}}>
        <Grid item lg={10} md={16} xs={16}>
          <MapOverview
            data={listData}
            center={mapCenter}
            zoom={mapZoom}
            handleMarkerClick={openAnnouncementDialog}
            goToPos={goToPos}
            updateMap={updateMap}
          />

        </Grid>
        <Grid container item lg={6} md={16} xs={16}>
          <Stack spacing={0} sx={{width: "100%", minHeight: '600px'}}>
            <FiltersDialog
              open={filtersDialogOpen}
              filters={filters}
              setOpen={setFiltersDialogOpen}
              handleAccept={updateFilters}
              showOnMap={showOnMap}
              setShowDistance={listDistance}
            />
            <DataGridList
              data={listData}
              handleRowClick={openAnnouncementDialog}
              reload={refreshData}
              showDistance={showDistance}
            />

          </Stack>
        </Grid>
      </Grid>
      <AnnouncementDialog
        open={announcementDialogOpen}
        announcementData={announcementData}
        setOpen={setAnnouncementDialogOpen}
        showOnMap={showOnMap}
        chatRedirect={chatRedirect}
      />
    </BrowserRouter>
  );
}