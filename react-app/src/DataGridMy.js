import { useState, useEffect } from 'react';
import { DataGrid, GridFooterContainer, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, plPL } from '@mui/x-data-grid';
import { Pagination } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, CircularProgress, LinearProgress, Collapse, Alert, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ImageIcon from '@mui/icons-material/Image';
import Badge from '@mui/material/Badge';
import { Stack, Box } from '@mui/material';
import { Typography } from '@mui/material';
import EditAnnouncement from './EditAnnouncement';
import AnnouncementNotifications from './AnnouncementNotifications';
import AnnouncementDialog from './AnnouncementDialog';

import moment from 'moment';
import 'moment/locale/pl';

moment.locale('pl');

const theme = createTheme(
    {},
    plPL,
);
const StyledDataGrid = styled(DataGrid)(() => ({
    '& .MuiDataGrid-root:focus': {
        outline: 'none'
    },
    '& .MuiDataGrid-cell:focus': {
        outline: 'none'
    },
    '& .MuiDataGrid-cell:hover': {
        cursor: 'pointer'
    }
}));
function createData(id, title, category, type, createDate, im, notifications_count) {
    let image = process.env.REACT_APP_SERVER_ROOT_URL + "/anons/photo?name=" + im;
    return { id, title, category, type, createDate, image, notifications_count };
}

function formatDate(el) {
    return moment(el.value).fromNow();
}

export default function DataGridMy() {
    const [announcementData, setAnnouncementData] = useState([]);
    const [notificationsData, setNotificationsData] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openNotificationsDialog, setOpenNotificationsDialog] = useState({ open: false });
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
            let url = process.env.REACT_APP_SERVER_ROOT_URL + '/anons/my';
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (response.status === 401) {
                    sessionStorage.clear();
                    window.location.assign("/login");
                    return;
                }
                const json = await response.json();
                const rows = [];
                json.list.forEach(element => {
                    rows.push(createData(
                        element.id,
                        element.title,
                        (element.category === 0 ? "Zaginięcie" : "Znalezienie"),
                        element.type,
                        element.create_date,
                        element.image,
                        element.notifications_count
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
        let url = process.env.REACT_APP_SERVER_ROOT_URL + '/anons?id=' + id;
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
    const fetchNotificationsData = async (id) => {
        let url = process.env.REACT_APP_SERVER_ROOT_URL + '/anons/notifications?id=' + id;
        setLoading(true);
        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });
            const json = await response.json();
            setNotificationsData(json);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log("error", error);
        }
    };
    const handleRowClick = (row) => {
        setAnnouncementData([]);
        setOpen(true);
        fetchAnnouncementData(row.id);
    }
    async function deleteAnnouncement(announcementData) {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/anons/', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ 'id': announcementData }) //TODO this doesnt work?
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
    function CustomFooter() {
        return (
            <GridFooterContainer>
                <IconButton sx={{ float: 'left' }} onClick={() => (setReload((prev) => !(prev)))}><RefreshIcon /></IconButton>
                <CustomPagination />
            </GridFooterContainer>
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
                            columns={[
                                // {
                                //   field: 'id',
                                //   headerName: 'ID',
                                //   width: 10,
                                // },
                                {
                                    field: 'image',
                                    headerName: <ImageIcon />,
                                    flex: 0.2,
                                    editable: false,
                                    sortable: false,
                                    renderCell: (params) => (params.value !== process.env.REACT_APP_SERVER_ROOT_URL + "/anons/photo?name=" ? <img src={params.value} style={{ width: "50px", height: "50px", objectFit: "cover" }} /> : ""), // renderCell will render the component
                                },
                                {
                                    field: 'title',
                                    headerName: 'Tytuł',
                                    description: 'Tytuł',
                                    flex: 1,
                                },
                                {
                                    field: 'category',
                                    headerName: 'Rodzaj',
                                    description: 'Rodzaj ogłoszenia',
                                    flex: 0.2,
                                },
                                {
                                    field: 'type',
                                    headerName: 'Zwierze',
                                    description: 'Typ zwierzecia',
                                    flex: 0.2,
                                },
                                {
                                    field: 'createDate',
                                    headerName: 'Dodane',
                                    description: 'Data dodania ogłoszenia',
                                    type: 'dateTime',
                                    flex: 0.5,
                                    valueFormatter: formatDate
                                },
                                {
                                    field: '',
                                    headerName: '',
                                    // description: 'powiadomienia',
                                    flex: 0.01,
                                    filterable: false,
                                    disableColumnMenu: true,
                                    sortable: false,
                                    align: 'center',
                                    renderCell: (cellValues) => {
                                        const handleClick = (event, cellValues) => {
                                            event.stopPropagation();
                                            setNotificationsData([]);
                                            setOpenNotificationsDialog({ open: true, row: cellValues });
                                            fetchNotificationsData(cellValues.row.id);
                                        };
                                        return (
                                            <IconButton onClick={(event) => { handleClick(event, cellValues) }}>
                                                <Badge badgeContent={cellValues.row.notifications_count} size='small' color="error">
                                                    <NotificationsIcon />
                                                </Badge>
                                            </IconButton>
                                        );
                                    }
                                },
                            ]}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                            onRowClick={handleRowClick}
                            disableSelectionOnClick
                            loading={data.length === 0}
                            components={{
                                // Toolbar: CustomToolbar,
                                Footer: CustomFooter,
                            }}
                            disableColumnMenu
                        />
                    )}
            </ThemeProvider>
            <AnnouncementDialog
                isMy={true}
                open={open}
                announcementData={announcementData}
                setOpen={setOpen}
                setOpenEditDialog={setOpenEditDialog}
                setOpenDeleteDialog={setOpenDeleteDialog}
            />
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
            <Dialog open={openNotificationsDialog.open} onClose={() => (setOpenNotificationsDialog({ open: false }))} maxWidth="md" fullWidth>
                <DialogTitle>Notyfikacje</DialogTitle>
                {loading ? (
                    <Stack alignItems="center" m={3}>
                        <CircularProgress />
                    </Stack>
                ) : (
                    <AnnouncementNotifications row={notificationsData} parentCallback={handleCallback} />
                )}
            </Dialog>
            <Dialog open={openImageDialog.open} onClose={() => (setOpenImageDialog((prev) => ({ open: false, src: prev.src })))} fullWidth>
                <img src={openImageDialog.src} alt={announcementData.title} />
            </Dialog>
        </div>
    );
}