import { useState, useEffect } from 'react';
import { DataGrid, plPL } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, CircularProgress, Button } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
const theme = createTheme(
  {},
  plPL,
);
const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 10,
  },
  {
    field: 'title',
    headerName: 'Tytuł',
    flex: 1,
  },
  {
    field: 'category',
    headerName: 'Kategoria',
    flex: 0.2,
  },
  {
    field: 'type',
    headerName: 'Typ',
    flex: 0.2,
  },
  // {
  //   field: 'time',
  //   headerName: 'Data dodania',
  //   type: 'dateTime',
  //   width: 170,
  //   editable: false,
  // },
];
function createData(id, title, category, type) {
  return { id, title, category, type };
}


export default function DataGridList() {
  const [announcementData, setAnnouncementData] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      let url = 'http://localhost:2400/anons/list';
      try {
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include'
        });
        const json = await response.json();
        const rows = [];
        json.list.forEach(element => {
          rows.push(createData(
            element.id,
            element.title,
            (element.category === 0 ? "Zaginięcie" : "Znalezienie"),
            element.type
          ));
        });
        setData(rows);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData();
  }, []);
  const fetchAnnouncementData = async (id) => {
    let url = 'http://localhost:2400/anons?id=' + id;
    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include'
      });
      const json = await response.json();
      setAnnouncementData(json);
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleRowClick = (row) => {
    setAnnouncementData([]);
    setOpen(true);
    fetchAnnouncementData(row.id);
  }

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ThemeProvider theme={theme}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          onRowClick={handleRowClick}
          disableSelectionOnClick
          loading={data.length === 0}
        />
      </ThemeProvider>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth={true}>
        {announcementData.length === 0 ? (
          <Stack alignItems="center" m={3}>
            <CircularProgress />
          </Stack>
        ) : (
          <div>
            <DialogTitle>{announcementData.title}</DialogTitle>
            <DialogContent>
              <Typography variant="subtitle1">Opis</Typography>
              <DialogContentText>
                {announcementData.description}
              </DialogContentText>
              <Divider />
              <Typography variant="subtitle1">Zdjęcia</Typography>
              {announcementData.images && announcementData.images.map((element) => (
                <img style={{ width: "100px", height: "100px", objectFit: "cover", margin: 4 }} src={'http://localhost:2400/anons/photo?name=' + element}
                  alt={announcementData.title} key={announcementData.id} />
              ))}
              <Divider />
              <Stack justifyContent="space-between" direction="row" alignContent="center" spacing={2}>
                <span>
                  <Typography variant="subtitle1">Typ</Typography>
                  <DialogContentText>
                    {announcementData.type}
                  </DialogContentText>
                </span>
                <span>
                  <Typography variant="subtitle1">Rasa</Typography>
                  <DialogContentText>
                    {announcementData.breed}
                  </DialogContentText>
                </span>
                <span>
                  <Typography variant="subtitle1">Owłosienie</Typography>
                  <DialogContentText>
                    {announcementData.coat}
                  </DialogContentText>
                </span>
                <span>
                  <Typography variant="subtitle1">Umaszczenie</Typography>
                  <DialogContentText>
                    {announcementData.color}
                  </DialogContentText>
                </span>
              </Stack>
              <Divider />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => (setOpen(false))}>Wróć</Button>
              <Button onClick={() => (console.log(announcementData.id))}>Pokaż na mapie</Button>
            </DialogActions>
          </div>
        )}
      </Dialog>
    </div>
  );
}