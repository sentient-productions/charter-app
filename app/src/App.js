import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import {Box, Button, Grid, TextField} from '@mui/material';
import * as Plotly from 'plotly.js';

function App() {
  // persistent data states
  const [rawData, setRawData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  // query helpers
  const [query, setQuery] = useState("");
  const [isPlotted, setIsPlotted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseCode, setResponseCode] = useState("fig = px.histogram(dataset[dataset.job_title == 'Data Scientist'], x=\"salary_in_usd\", title='Average Data Scientist Salary'); xxxx; yyyy;");

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
    fetch('./salaries.csv')
    .then((r) => r.text())
    .then((defaultData) => {
      processData(defaultData)
    })
  }, []);

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
              label="Plot Query"
              variant="outlined" 
              onChange={handleQueryInput}
              placeholder={"Histogram of average data scientist salary"}
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
        <Button variant="contained" component="label" sx={{pb: - 3}}>
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
