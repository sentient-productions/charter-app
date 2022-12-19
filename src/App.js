import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import * as Plotly from 'plotly.js';
import { DataGrid } from '@mui/x-data-grid';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { InputAdornment } from '@mui/material';
import Menu from '@mui/material/Menu';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const URL = "https://www.rango.run/"

const datasetQueries = { 
  "PLOT" : {
    "salaries.csv": "20 bin Histogram of salary, stacked by experience level",
    "AAPL.csv": "5d moving average of stock price for last 30 entries",
    "cars.csv": "Scatter plot of horsepower vs city mpg, colored by weight",
    "major_ports.csv": "Scatter plot of latitude vs. longitude for Brazilian ports",
    "2022_congress_fundraise.csv": "Box plot of cash on hand by party",
    "airbnb_listings.csv": "2d scatter plot of latitude vs longitude, weighted by average rating",
    "scooby.csv": "Time series of imdb score vs. date aired",
    "series.csv": "Scatter plot of Ratings vs cleaned Votes, clipped at 100k",
    "financial_sample.xlsx": "Histogram of gross sales, cleaned and clipped at 95th percentile",
  },
  "TABLE" : {
    "salaries.csv": "20 bin Histogram of salary, stacked by experience level",
    "AAPL.csv": "5d moving average of stock price for last 30 entries",
    "cars.csv": "Scatter plot of horsepower vs city mpg, colored by weight",
    "major_ports.csv": "Scatter plot of latitude vs. longitude for Brazilian ports",
    "2022_congress_fundraise.csv": "Box plot of cash on hand by party",
    "airbnb_listings.csv": "2d scatter plot of latitude vs longitude, weighted by average rating",
    "scooby.csv": "Time series of imdb score vs. date aired",
    "series.csv": "Scatter plot of Ratings vs cleaned Votes, clipped at 100k",
    "financial_sample.xlsx": "Histogram of gross sales, cleaned and clipped at 95th percentile",
  }
}

function App() {
  // persistent data states
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [dataset, setDataset] = useState("salaries.csv");

  // query helpers
  const [query, setQuery] = useState("20 bin Histogram of salary, stacked by experience level");
  const [defaultQuery, setDefaultQuery] = useState("20 bin Histogram of salary, stacked by experience level");
  const [queryMode, setQueryMode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [responseCode, setResponseCode] = useState("");

  // table helpers
  const [tableColumns, setTableColumns] = useState([]);
  const [tableRows, setTableRows] = useState([]);

  // process CSV data
  const processData = dataString => {
    setRawData(dataString)
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    
    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        obj['id'] = i;
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"')
              d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"')
              d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter(x => x).length > 0) {
          list.push(obj);
        }
      }
    }
    // prepare columns list from headers
    const columns = headers.map(c => ({
      field: c,
      headerName: c,
      description: c,
      sortable: true,
      width: 160,
    }));
    setData(list);
    setColumns(columns);
  }

  // handle dataset selection 
  const handleDatasetSelect = (event) => {
    setDataset(event.target.value);
    const queryType = queryMode == 0 ? "PLOT" : "TABLE"
    setDefaultQuery(datasetQueries[event.target.value])
    setQuery(datasetQueries[event.target.value])
  }

  // handle file upload
  const handleFileUpload = e => {
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
  }

  const handleQueryInput = (event) => {
    setQuery(event.target.value);
  };

  const handleQuerySubmit = () => {
    setIsLoading(true)
    try {
      let formData = new FormData()
      formData.append("rawData", rawData);
      formData.append("query", query);
      const endpoint = queryMode == 0 ? URL :URL + "/table"
      fetch(endpoint, {
          method: 'POST',
          body: formData

      })
      .then(response => {
        return response.text()
      })
      .then(jsonText => {
        if (queryMode == 0) {
          var figure = JSON.parse(jsonText);
          console.log("figure data=", figure)
          figure.layout.template = "plotly_dark"
          figure.layout.plot_bgcolor = "#1f1f1f"
          figure.layout.paper_bgcolor = "#1f1f1f"
          figure.layout.font = {color: "#ffffff"}
          console.log("laout=", figure.layout)
          Plotly.newPlot('graph-div', figure.data, figure.layout)
          setResponseCode("Query: \"" + query + "\", " + "generated code shown below;" + figure.response_code)
          setIsLoading(false)
        } else {
          const table = JSON.parse(jsonText);
          console.log("table data=", table)
          setTableColumns(table["header"].map(header => ({name:header, selector:header})));
          // enumeratd map over rows 
          setTableRows(table["rows"].map(row => {
              let result = {}
              for (let i = 0; i < table["header"].length; i++) {
                result[table["header"][i]] = row[i]
              }
              return result
            })
          );
          setIsLoading(false)
        }
      });
    } catch (error) {
      console.log("caught error=", error)
      setResponseCode(error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch('./'+dataset)
    .then((r) => r.text())
    .then((defaultData) => {
      processData(defaultData)
    })
  }, [dataset]);

  return (
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={8} sx={{mt:10}}>
          <Grid item sx={{mb:2.5}} >
            <TextField 
              fullWidth
              label={"Query"}
              variant="outlined" 
              onChange={handleQueryInput}
              placeholder={defaultQuery}
              InputProps={
                {
                  sx: {borderRadius: '16px'},
                  startAdornment: 
                    <InputAdornment sx={{mr: 2}}> 
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <React.Fragment>
                            <Button variant="outlined" {...bindTrigger(popupState)}>
                              {queryMode == 0 ? <ShowChartIcon /> : <TableRowsIcon />}
                            </Button>
                            <Menu {...bindMenu(popupState)}>
                              <MenuItem onClick={() => {
                                setQueryMode(0)
                                popupState.close()
                              }}>
                                <ShowChartIcon /> 
                              </MenuItem>
                              <MenuItem onClick={() => {
                                setQueryMode(1)
                                popupState.close()
                              }}>
                                <TableRowsIcon /> 
                              </MenuItem>
                            </Menu>
                          </React.Fragment>
                        )}
                      </PopupState>
                    </InputAdornment>,
                  endAdornment: 
                    <Button 
                      onClick={handleQuerySubmit}
                      variant="contained" 
                      disabled={data.length==0 || query == "" || isLoading} 
                      sx={{ml: 1}}
                    >
                      Generate
                    </Button>
                }
              }
            />
          </Grid>
          <SyntaxHighlighter language="sql" style={obsidian} >
          {`SELECT tweet_url, text, like_count
            FROM tweets
            WHERE user_id = (SELECT user_id
                             FROM users
                             WHERE (lower(user_name) = lower('ilyasut'))
                             ORDER BY followers_count DESC
                             LIMIT 1)
            ORDER BY like_count DESC
            LIMIT 10`} 
          </SyntaxHighlighter>
          {queryMode == 0 && 
             <Grid sx={{mb: 2}} container alignItems="center" justifyContent="center">
                <div id="graph-div"/>
              </Grid>  
          }

          <FormControl sx={{height:75, minHeight: 75, minWidth: 300}}>
            <InputLabel>Selected Dataset</InputLabel>
            <Select
              value={dataset}
              onChange={handleDatasetSelect}
            >
              <MenuItem value={"salaries.csv"}>Salaries</MenuItem>
              <MenuItem value={"AAPL.csv"}>Apple Stock Price</MenuItem>
              <MenuItem value={"cars.csv"}>Cars</MenuItem>
              <MenuItem value={"major_ports.csv"}>Major International Ports</MenuItem>
              <MenuItem value={"2022_congress_fundraise.csv"}>2022 Congress Fundraising</MenuItem>
              <MenuItem value={"airbnb_listings.csv"}>Airbnb Listings in Boston</MenuItem>
              <MenuItem value={"scooby.csv"}>Scooby Doo Episodes</MenuItem>
              <MenuItem value={"series.csv"}>Thriller, Crime, and Action Series</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" component="label" sx={{mt: 1, ml: 1 }}>
            Upload Custom
            <input
              hidden
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
            />
          </Button>
          <Grid sx={{mt:1}}>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={data}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                experimentalFeatures={{ newEditingApi: true }}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
  );
}

export default App;
