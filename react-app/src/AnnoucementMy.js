import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import { Dialog, Button } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActions } from '@mui/material';
import { Alert } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { styled } from '@mui/system';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';


import EditAnnouncement from './EditAnnouncement';

function createData(id, title, category, create_date, description, image, type) {
  return { id, title, category, create_date, description, image, type };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [id, setId] = useState();
  const [enabled, setEnabled] = useState(true);
  const [alert, setAlert] = useState({
    "value": "",
    "severity": "",
    "hidden": true,
    "disableButton": false
  });

  const StyledTableRow = styled(TableRow)(() => ({
    backgroundColor: '#ff7b63',
  }));

  async function deleteAnnouncement(announcementData) {
    // console.log(JSON.stringify(id));
    try {
      const response = await fetch(process.env.REACT_APP_SERVER_ROOT_URL + '/anons/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(announcementData)
      });
      return response;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  }

  const handleDelete = async e => {
    e.preventDefault();
    const response = await deleteAnnouncement({
      id
    });
    if (response.status === 200) {
      setAlert({
        "value": "Pomyślnie usunięto ogłoszenie.",
        "severity": "success",
        "hidden": false,
        "disableButton": true
      })
      setTimeout(() => {
        setAlert({ "hidden": true, "disableButton": false });
        setOpenDeleteDialog(false);
        setEnabled(false);
      }, 3000);
    }
    else {
      setAlert({
        "value": "Błąd: " + response.status,
        "severity": "error",
        "hidden": false
      })
      setTimeout(() => {
        setAlert({ "hidden": true, "disableButton": false });
        setOpenDeleteDialog(false);
      }, 3000);
    }
    console.log(response);
  }

  const handleOpenDeleteDialog = (e) => {
    setOpenDeleteDialog((prev) => !(prev));
    setId(parseInt(e.target.id));
  }
  const handleOpenEditDialog = (e) => {
    setOpenEditDialog((prev) => !(prev));
  }
  const handleCallback = (childData) => {
    if (childData?.status === 200) {
      setAlert({
        "value": "Pomyślnie zapisano.",
        "severity": "success",
        "hidden": false,
        "disableButton": true
      })
      setTimeout(() => {
        setAlert({ "hidden": true, "disableButton": false });
        setOpenEditDialog(false);
      }, 3000);
    }
    else {
      setAlert({
        "value": "Błąd: " + childData.status,
        "severity": "error",
        "hidden": false
      })
      setTimeout(() => {
        setAlert({ "hidden": true, "disableButton": false });
        setOpenEditDialog(false);
      }, 3000);
    }
  }
  if (enabled)
    return (
      <React.Fragment>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} onClick={() => setOpen(!open)}>
          <TableCell component="th" scope="row">{row.title}</TableCell>
          <TableCell align="right">{(row.category === 0 ? "Zaginięcie" : "Znalezienie")}</TableCell>
          <TableCell align="right">{row.create_date}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Stack direction="row" justifyContent="space-between" alignItems="stretch" sx={{ margin: 1 }}>
                <img style={{ width: "100px", height: "100px", objectFit: "cover" }} src={process.env.REACT_APP_SERVER_ROOT_URL + '/anons/photo?name=' + row.image} alt={row.title} />
                <Typography variant="h4">{row.title}</Typography>
                <Button id={row.id} variant="contained" onClick={handleOpenEditDialog}>
                  Edytuj
                </Button>
                <Dialog open={openEditDialog} onClose={handleOpenEditDialog} fullWidth>
                  <DialogTitle>Edytuj ogłoszenie</DialogTitle>
                  <EditAnnouncement row={row} parentCallback={handleCallback}/>
                  <Alert severity={alert.severity !== "" ? alert.severity : "error"} hidden={alert.hidden}>{alert.value}</Alert>
                </Dialog>
                <Button id={row.id} variant="contained" onClick={handleOpenDeleteDialog} color='error'>
                  Usuń
                </Button>
                <Dialog open={openDeleteDialog} onClose={handleOpenDeleteDialog} fullWidth>
                  <DialogTitle>Usuń ogłoszenie</DialogTitle>
                  <DialogActions>
                    <Button onClick={handleOpenDeleteDialog}>Anuluj</Button>
                    <Button color='error' onClick={handleDelete} disabled={alert.disableButton}>Usuń</Button>
                  </DialogActions>
                  <Alert severity={alert.severity !== "" ? alert.severity : "error"} hidden={alert.hidden}>{alert.value}</Alert>
                </Dialog>
              </Stack>
              {/* <Box sx={{ margin: 1 }}>
            </Box> */}
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  else
    return (
      <React.Fragment>
        <StyledTableRow >
          <TableCell colSpan={3} align='center' component="th" scope="row">To ogłoszenie zostało usunięte</TableCell>
        </StyledTableRow>
      </React.Fragment>
    );
}

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  // const handleLastPageButtonClick = (event) => {
  //   onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  // };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      {/* <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton> */}
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function AnnoucementMy() {
  const [data, setData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [pageToFetch, setPageToFetch] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  useEffect(() => {
    const fetchData = async (pageToFetch) => {
      let url = process.env.REACT_APP_SERVER_ROOT_URL + '/anons/my?page=' + (pageToFetch);
      // console.log(url);
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
            element.category,
            element.create_date,
            element.description,
            element.image,
            element.type
          ));
        });
        // console.log(rows);
        setData((prev) => (prev.concat(rows))); // TO JEST DO POPRAWY
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchData(pageToFetch);
  }, [pageToFetch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    if ((3 * pageToFetch) < (newPage + 1)) {
      setPageToFetch((parseInt(newPage / 3) + 1));
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <TableContainer component={Paper}>
      <Table /*sx={{ minWidth: 650 }}*/>
        <TableHead>
          <TableRow>
            <TableCell>Tytuł</TableCell>
            <TableCell align="right">Kategoria</TableCell>
            <TableCell align="right">Data dodania</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : data
          ).map((row) => (
            <Row key={row.id} row={row} />
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[]}
              colSpan={3}
              count={data.length + 1}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              labelDisplayedRows={() => (null)}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
