
import { DataGrid, GridFooterContainer, gridPageCountSelector, gridPageSelector, useGridApiContext, useGridSelector, plPL } from '@mui/x-data-grid';
import { Pagination, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import ImageIcon from '@mui/icons-material/Image';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import moment from 'moment';
import 'moment/locale/pl';

moment.locale('pl');

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
    field: 'image',
    headerName: <ImageIcon />,
    flex: 0.2,
    editable: false,
    sortable: false,
    renderCell: (params) => (params.value !== process.env.REACT_APP_SERVER_ROOT_URL + "/anons/photo?name=" ? <img src={params.value} alt="" style={{ width: "50px", height: "50px", objectFit: "cover"}}/> : ""), // renderCell will render the component
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
    flex: 0.15,
  },
  {
    field: 'distance',
    headerName: 'Odległość',
    description: 'Odległość w km od wybranej lokacji',
    flex: 0.2,
  },
  {
    field: 'create_date',
    headerName: 'Dodane',
    description: 'Data dodania ogłoszenia',
    type: 'dateTime',
    flex: 0.5,
    valueFormatter: formatDate
  },
];
function formatDate(el) {
  return moment(el.value).fromNow();
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
          rows={((props.data === undefined || props.data === null) ? ([]) : (props.data))}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          onRowClick={handleRowClick}
          disableSelectionOnClick
          loading={props.data === undefined || props.data === null}
          components={{
            // Toolbar: CustomToolbar,
            Footer: CustomFooter,
          }}
          columnVisibilityModel={{
            distance: props.showDistance
          }}
          disableColumnMenu
        />
      </ThemeProvider>
    </div>
  );
}