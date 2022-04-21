//import { useState, useEffect } from 'react';
import { DataGrid, GridFooterContainer, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, plPL } from '@mui/x-data-grid';
import { Pagination, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
/*import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, CircularProgress, Button } from '@mui/material';
import { Stack } from '@mui/material';
import { Typography } from '@mui/material';
import { Divider } from '@mui/material';
import AnnouncementDialog from './AnnouncementDialog';*/

const theme = createTheme({
},
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
    flex: 0.15,
  },
  {
    field: 'distance',
    headerName: 'Odległość',
    flex: 0.2,
  },
  {
    field: 'create_date',
    headerName: 'Data dodania',
    type: 'dateTime',
    flex: 0.5,
  },
];
function createData(id, title, category, type, createDate) {
  return { id, title, category, type, createDate };
}


export default function DataGridList(props) {
  const handleRowClick = (row) => {
    props.handleRowClick(row.id);
  }
  const handleReload = () => {
    props.reload();
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
  function CustomFooter(props) {
    return (
      <GridFooterContainer>
        <IconButton sx={{ float: 'left' }} onClick={handleReload}><RefreshIcon /></IconButton>
        <CustomPagination />
      </GridFooterContainer>
    );
  }
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ThemeProvider theme={theme}>
        <StyledDataGrid
          rows={props.data}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          onRowClick={handleRowClick}
          disableSelectionOnClick
          loading={props.data === undefined || props.data.length === 0}
          components={{
            // Toolbar: CustomToolbar,
            Footer: CustomFooter,
          }}
          columnVisibilityModel={{
            distance: props.showDistance
          }}
        />
      </ThemeProvider>
    </div>
  );
}