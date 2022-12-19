import React, { useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export default function Data({ state, setState }) {
  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
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
      sortable: true
      // resizable: true, -> Only works for DataGridPro, we need to purchase this module.
      // width: 160,
      // editable: true,
    }));
    setState({ ...state, columns: columns, rows: rows, raw: dataString });
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  // handle dataset selection
  const handleDatasetSelect = (event) => {
    setState({ ...state, dataset: event.target.value });
  };

  useEffect(() => {
    fetch('./' + state.dataset)
      .then((r) => r.text())
      .then((defaultData) => {
        processData(defaultData);
      });
  }, [state.dataset]);

  return (
    <Grid>
      <FormControl sx={{ height: 75, minHeight: 75, minWidth: 300 }}>
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
        </Select>
      </FormControl>
      {/* Upload custom user data */}
      <Button variant="contained" component="label" sx={{ mt: 1, ml: 1 }}>
        Upload Custom
        <input
          hidden
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileUpload}
        />
      </Button>
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
    </Grid>
  );
}
