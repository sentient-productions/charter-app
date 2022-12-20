import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Button,
  FormControl,
  Divider,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import {
  Save as SaveIcon,
} from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { DataGrid } from '@mui/x-data-grid';
import { DATASET_QUERIES, URL } from './constants';

export default function Data({ state, setState }) {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    let headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
    headers = headers.map((header) => header.replace(/"/g, ''));
    const rows = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        obj['id'] = i;
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          rows.push(obj);
        }
      }
    }
    // prepare columns rows from headers
    const columns = headers.map((c) => ({
      field: c,
      headerName: c,
      description: c,
      sortable: true,
      minWidth: 150
      // resizable: true, -> Only works for DataGridPro, we need to purchase this module.
      // width: 160,
      // editable: true,
    }));
    setState({ ...state, columns: columns, rows: rows, raw: dataString });
  };

  // handle file upload
  const handleFileUpload = (e) => {
    setIsLoading(true);
    const endpoint = URL + '/upload';
    const storedToken = localStorage.getItem('storage-token');
    console.log('storedToken=', storedToken);
    var data = new FormData();
    data.append('file', e.target.files[0]);
    // TODO - update to use the proper UUID check
    if (storedToken != null  && storedToken.split('-').length == 5) {
      data.append('token', storedToken);
    }

    fetch(endpoint, {
      method: 'POST',
      body: data
    })
      .then((response) => {
        return response.text();
      })
      .then((token) => {
        if (storedToken == null || storedToken.split('-').length != 5) {
          localStorage.setItem('storage-token', token);
        }
        updateUserList();
        setIsLoading(false);
      });
  };

  // handle dataset selection
  const handleDatasetSelect = (event) => {
    console.log('handlign a select for dataset=', event.target.value)
    setState({ ...state, dataset: event.target.value });
  };

  useEffect(() => {
    const endpoint = URL + 'get-dataset';
    let formData = new FormData();
    formData.append('name', state.dataset);
    if (DATASET_QUERIES[0][state.dataset] === undefined) {
      console.log("appending token  = ", localStorage.getItem('storage-token'))
      formData.append('token', localStorage.getItem('storage-token'));
    }
    fetch(endpoint, {
      method: 'POST',
      body: formData
    })
      .then((r) => r.text())
      .then((defaultData) => {
        processData(defaultData);
      });
  }, [state.dataset]);

  const updateUserList = () => {
    const endpoint = URL + 'list-user-files?';
    const storedToken = localStorage.getItem('storage-token');
    var formData = new FormData();
    // TODO - update to use the proper UUID check
    if (storedToken != null  && storedToken.split('-').length == 5) {
      formData.append('token', storedToken);
      // add storedToken as an input argument to fetch
      fetch(endpoint + new URLSearchParams({
        token: storedToken,
      }))
        .then((r) => r.text())
        .then((userListString) => {
          setList(userListString.split(','))
        });
    }
  }

  useEffect(() => {
    updateUserList();
  }, []);

  return (
    <Grid container sx={{ mt: 2.5 }}>
      <Grid item md={5} xs={7}>
        <FormControl sx={{ height: 75, minHeight: 75 }} fullWidth>
          <InputLabel>Selected Data</InputLabel>
          <Select
            value={state.dataset}
            onChange={handleDatasetSelect}
            displayEmpty
            label="Package Type"
          >
            <MenuItem value={'salaries.csv'}>AI Salaries</MenuItem>
            <MenuItem value={'AAPL.csv'}>Apple Stock Price</MenuItem>
            <MenuItem value={'cars.csv'}>Cars</MenuItem>
            <MenuItem value={'major_ports.csv'}>
              Major International Ports
            </MenuItem>
            <MenuItem value={'2022_congress_fundraise.csv'}>
              2022 Congress Fundraising
            </MenuItem>
            <MenuItem value={'airbnb_listings.csv'}>
              Airbnb Listings in Boston
            </MenuItem>
            <MenuItem value={'scooby.csv'}>Scooby Doo Episodes</MenuItem>
            <MenuItem value={'series.csv'}>
              Thriller, Crime, and Action Series
            </MenuItem>
            {list.length > 0 &&   <Divider > Your Data </Divider> }
            {list.length > 0 &&              
              list.map((item) => (
                <MenuItem value={item}>
                  {item}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item md={4} xs={5}>
        {
          isLoading ?
          <LoadingButton
          loading
          startIcon={<SaveIcon />}
          variant="contained"
          color="primary"
          sx={{ mt: 1, ml: 1 }}
        >
          Loading
        </LoadingButton>
        :
          <Button variant="contained" component="label" sx={{ mt: 1, ml: 1 }}>
            Upload Custom
            <input
              hidden
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </Button>
        }
      </Grid>
      {/* Selected data */}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={state.rows}
          columns={state.columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
      {/* // Padding to avoid footer issues */}
      <Box sx={{ height: 100, width: '100%' }} />
    </Grid>
  );
}
