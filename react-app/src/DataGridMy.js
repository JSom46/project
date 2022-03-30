import { useState, useEffect } from 'react';
import { DataGrid, GridFooterContainer, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, plPL } from '@mui/x-data-grid';
import { Pagination } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, CircularProgress, LinearProgress, Collapse, Alert, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Stack, Box } from '@mui/material';
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import EditAnnouncement from './EditAnnouncement';

const theme = createTheme(
    {},
    plPL,
);
const StyledDataGrid = styled(DataGrid)(() => ({
    '& .MuiDataGrid-cell:focus': {
        outline: 'none'
    },
    '& .MuiDataGrid-cell:hover': {
        cursor: 'pointer'
    }
}));
const columns = [
    // {
    //   field: 'id',
    //   headerName: 'ID',
    //   width: 10,
    // },
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
    {
        field: 'createDate',
        headerName: 'Data dodania',
        type: 'dateTime',
        flex: 0.5,
    },
];
function createData(id, title, category, type, createDate) {
    return { id, title, category, type, createDate };
}

export default function DataGridMy() {
    const [announcementData, setAnnouncementData] = useState([]);
    const [tab, setTab] = useState(0);
    const [open, setOpen] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openImageDialog, setOpenImageDialog] = useState({ open: false });
    const [alertData, setAlertData] = useState({
        open: false,
        variant: 'filled',
        severity: 'success',
        text: 'tekst'
    });
    const [inDeletionProcess, setInDeletionProcess] = useState(false);
    const [data, setData] = useState([]);
    const [reload, setReload] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setData([]);
            let url = 'http://localhost:2400/anons/my';
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
                        element.type,
                        element.create_date
                    ));
                });
                setData(rows);
            } catch (error) {
                setFetchError(true);
                console.log("error", error);
            }
        };
        fetchData();
    }, [reload]);
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
    // const fetchNotificationsData = async (id) => {
    //     let url = 'http://localhost:2400/notifications?id=' + id;
    //     try {
    //         const response = await fetch(url, {
    //             method: 'GET',
    //             credentials: 'include'
    //         });
    //         const json = await response.json();
    //         setAnnouncementData(json);
    //     } catch (error) {
    //         console.log("error", error);
    //     }
    // };
    const handleRowClick = (row) => {
        setAnnouncementData([]);
        setOpen(true);
        fetchAnnouncementData(row.id);
    }
    const handleImageClick = (image) => {
        setOpenImageDialog({
            open: true,
            src: image.target.src
        })
    }
    async function deleteAnnouncement(announcementData) {
        try {
            const response = await fetch('http://localhost:2400/anons/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ 'id': announcementData })
            })
            return response;
        } catch (error) {
            console.log("error", error);
            return error;
        }
    }
    const handleDelete = async e => {
        e.preventDefault();
        setInDeletionProcess(true);
        const response = deleteAnnouncement(announcementData.id);
        setInDeletionProcess(false);
        response.then((response) => {
            setOpenDeleteDialog(false);
            setOpen(false);
            if (response.status === 200) {
                setReload((prev) => !(prev));
                setAlertData({
                    open: true,
                    variant: 'filled',
                    severity: 'success',
                    text: 'Pomyślnie usunięto ogłoszenie \'' + announcementData.title + '\''
                })
            }
            else {
                setAlertData({
                    open: true,
                    variant: 'filled',
                    severity: 'error',
                    text: 'Wystąpił błąd podczas usuwania ogłoszenia (' + response.status + ')'
                })
            }
        })
    }
    const handleCallback = (childData) => {
        setOpenEditDialog(false);
        setOpen(false);
        if (childData.status === 200) {
            setReload((prev) => !(prev));
            setAlertData({
                open: true,
                variant: 'filled',
                severity: 'success',
                text: 'Pomyślnie zapisano zmiany'
            })
        }
        else {
            setAlertData({
                open: true,
                variant: 'filled',
                severity: 'error',
                text: 'Wystąpił błąd podczas zapisywania zmian (' + childData.status + ')'
            })
        }
    }
    function CustomPagination() {
        const apiRef = useGridApiContext();
        const page = useGridSelector(apiRef, gridPageSelector);
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);

        return (
            <Pagination
                color="primary"
                count={pageCount}
                page={page + 1}
                onChange={(event, value) => apiRef.current.setPage(value - 1)}
            />
        );
    }
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };
    function CustomFooter() {
        return (
            <GridFooterContainer>
                <IconButton sx={{ float: 'left' }} onClick={() => (setReload((prev) => !(prev)))}><RefreshIcon /></IconButton>
                <CustomPagination />
            </GridFooterContainer>
        );
    }
    function TabPanel(props) {
        const { children, value, index } = props;

        return (
            <div>
                {value === index && (
                    <Box role="tabpanel" hidden={value !== index}>
                        {children}
                    </Box>
                )}
            </div>
        );
    }
    return (
        <div style={{ height: '100%', width: '100%' }}>
            <ThemeProvider theme={theme}>
                <Collapse in={alertData.open}>
                    <Alert
                        variant={alertData.variant}
                        severity={alertData.severity}
                        action={
                            <IconButton color="inherit" size="small" onClick={() => { setAlertData({ open: false }); }}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        } sx={{ mb: 2 }}>
                        {alertData.text}
                    </Alert>
                </Collapse>
                {(fetchError &&
                    <Box>
                        <Typography variant='caption'>Błąd serwera</Typography>
                        <IconButton onClick={() => { setFetchError(false); setReload((prev) => !(prev)) }}>
                            <RefreshIcon />
                        </IconButton>
                    </Box>
                ) ||
                    (!fetchError &&
                        <StyledDataGrid
                            autoHeight
                            rows={data}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            onRowClick={handleRowClick}
                            disableSelectionOnClick
                            loading={data.length === 0}
                            components={{
                                // Toolbar: CustomToolbar,
                                Footer: CustomFooter,
                            }}
                        />
                    )}

            </ThemeProvider>
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth={true}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tab} onChange={handleTabChange}>
                            <Tab label="Ogłoszenie" />
                            <Tab label="Powiadomienia" />
                        </Tabs>
                    </Box>
                    <TabPanel value={tab} index={0}>
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
                                    {(announcementData.images[0] !== '' && announcementData.images.length !== 0) &&
                                        <span>
                                            <Typography variant="subtitle1">Zdjęcia</Typography>
                                            {announcementData.images && announcementData.images.map((element) => (
                                                <img style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: 2, marginBottom: 2 }} src={'http://localhost:2400/anons/photo?name=' + element}
                                                    alt={announcementData.title} key={announcementData.id} onClick={handleImageClick} />
                                            ))}
                                            <Divider />
                                        </span>
                                    }
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
                                    <Button color='warning' onClick={() => (setOpenEditDialog(true))}>Edytuj</Button>
                                    <Button color='error' onClick={() => (setOpenDeleteDialog(true))}>Usuń</Button>
                                    <Button onClick={() => (
                                        window.location.href = "/dashboard" + "?lat=" + announcementData.lat + "&lng=" + announcementData.lng
                                    )}>Pokaż na mapie</Button>
                                </DialogActions>
                            </div>
                        )}
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        TO DO
                    </TabPanel>
                </Box>
            </Dialog>
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="md" fullWidth={true}>
                {inDeletionProcess ? <LinearProgress /> : null}
                <DialogTitle>Potwierdź usuwanie ogłoszenia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć ogłoszenie '{announcementData.title}'?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => (setOpenDeleteDialog(false))}>Anuluj</Button>
                    <Button color='error' onClick={handleDelete}>Usuń</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openEditDialog} onClose={() => (setOpenEditDialog(false))} fullWidth>
                <DialogTitle>Edytuj ogłoszenie</DialogTitle>
                <EditAnnouncement row={announcementData} parentCallback={handleCallback} />
            </Dialog>
            <Dialog open={openImageDialog.open} onClose={() => (setOpenImageDialog((prev) => ({ open: false, src: prev.src })))} fullWidth>
                <img src={openImageDialog.src} alt={announcementData.title} />
            </Dialog>
        </div>
    );
}