import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField} from '@mui/material';
import * as Plotly from 'plotly.js';
const datasetQueries = {
  "salaries.csv": "Histogram of salary, stacked by experience level",
  "AAPL.csv": "5d moving average of stock price for last 30 entries",
  "cars.csv": "Scatter plot of horsepower vs city mpg, colored by weight",
  "major_ports.csv": "Scatter plot of latitude vs. longitude for Brazilian ports",
  "2022_congress_fundraise.csv": "Box plot of cash on hand by party",
  "airbnb_listings.csv": "Scatter plot of lattitude vs longitude, weighted by average rating",
  "scooby.csv": "Time series of imdb score vs. date aired",
  "series.csv": "Scatter plot of Ratings vs cleaned Votes, clipped at 100k",
}


function App() {
  // persistent data states
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [dataset, setDataset] = useState("salaries.csv");

  // query helpers
  const [query, setQuery] = useState("");
  const [defaultQuery, setDefaultQuery] = useState("Histogram of average data scientist salary, stacked by experience level");
  const [isPlotted, setIsPlotted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseCode, setResponseCode] = useState("");

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
      name: c,
      selector: c,
    }));

    setData(list);
    setColumns(columns);
  }

  // handle dataset selection 
  const handleDatasetSelect = (event) => {
    console.log(event.target.value);
    setDataset(event.target.value);
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
    setIsPlotted(false);
    setIsLoading(true)
    try {
      let formData = new FormData()
      formData.append("rawData", rawData);
      formData.append("query", query);
      fetch('http://127.0.0.1:5000/', {
          method: 'POST',
          body: formData
      })
      .then(response => {
        return response.text()
      })
      .then(jsonText => {
        var figure = JSON.parse(jsonText);
        setIsPlotted(true)
        Plotly.newPlot('graph-div', figure.data, figure.layout)
        setResponseCode("Query: \"" + query + "\", " + "generated code shown below;" + figure.response_code)
        setIsLoading(false)
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
    <Grid container>
      <Grid item xs={12}>
        <h3>NeuralPlot</h3>
      </Grid>
      <Grid item xs={12}>
        <Grid container>
          <Grid item>
            <TextField 
              id="outlined-basic" 
              sx={{width: 500}}
              label="Plot Query"
              variant="outlined" 
              onChange={handleQueryInput}
              placeholder={defaultQuery}
              InputProps={
                {
                  endAdornment: 
                    (
                      <Button 
                        onClick={handleQuerySubmit}
                        variant="contained" 
                        disabled={data.length==0 || query == "" || isLoading} 
                        sx={{ml: 1}}
                      >
                        Plot
                      </Button>
                    )
                }
              }
            />
          </Grid>
          <Grid item sx={{mt:-2}} >
            {isPlotted &&
            
              responseCode.split(";").map((snippet) => {
                if (snippet == "" ) {
                  return null
                }
                
                return (
                  <Grid item sx={{mt:3}}>
                    <Box
                      component="div"
                      sx={{
                        display: 'inline',
                        p: 1,
                        m: 1,
                        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                        color: (theme) =>
                          theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                        border: '1px solid',
                        borderColor: (theme) =>
                        snippet.includes("Query") ? 'grey.800' : 'grey.300',
                        borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: '700',
                      }}
                    >
                      {snippet}
                    </Box> 
                  </Grid>
                )
              })
            }
          </Grid>
          <Grid item>
            {isPlotted && <div style={{width: 750, height: 750}} id="graph-div"/>}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{pt: 5}}>
        <FormControl sx={{height:75, minHeight: 75}}>
          <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dataset}
            label="Demo Dataset"
            onChange={handleDatasetSelect}
          >
            <MenuItem value={"salaries.csv"}>Salaries</MenuItem>
            <MenuItem value={"AAPL.csv"}>Apple Stock Price</MenuItem>
            <MenuItem value={"cars.csv"}>Cars</MenuItem>
            <MenuItem value={"major_ports.csv"}>Major International Ports</MenuItem>
            <MenuItem value={"2022_congress_fundraise.csv"}>2022 Congress Fundraising</MenuItem>
            <MenuItem value={"crypto_tweets.csv"}>Crypto Tweets</MenuItem>
            <MenuItem value={"airbnb_listings.csv"}>Airbnb Listings in Boston</MenuItem>
            <MenuItem value={"scooby.csv"}>Scooby Doo Episodes</MenuItem>
            <MenuItem value={"series.csv"}>Thriller, Crime, and Action Series</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" component="label" sx={{mt: 1, ml: 1 }}>
          Upload Custom Data
          <input
            hidden
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
          />
        </Button>
        <DataTable
          pagination
          highlightOnHover
          columns={columns}
          data={data}
        />
      </Grid>
    </Grid>
  );
}

export default App;
