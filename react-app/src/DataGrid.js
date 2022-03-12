import {useState,useEffect} from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    {
        field: 'id',
        headerName: 'ID',
        width: 50
    },
    {
        field: 'title',
        headerName: 'Tytuł',
        width: 200,
        editable: false,
    },
    {
        field: 'category',
        headerName: 'Kategoria',
        width: 100,
        editable: false,
    },
    {
        field: 'time',
        headerName: 'Data dodania',
        type: 'dateTime',
        width: 170,
        editable: false,
    },
];
function createData(id, title, category, time) {
    return { id, title, category, time };
  }

export default function DataGridDemo() {
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
                element.create_date
              ));
            });
            setData(rows);
          } catch (error) {
            console.log("error", error);
          }
        };
        fetchData();
      }, []);
    return (
        <div style={{ height:500, width: 570, margin:'auto'}}>
            <h5>data grid test</h5>
            {console.log(data)}
            <DataGrid
                rows={data}
                columns={columns}
                pageSize={15}
                rowsPerPageOptions={[15]}
                disabl
            />
        </div>
    );
}