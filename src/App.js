import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import DataTable from 'react-data-table-component';
import {Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Tab, Tabs, TextField} from '@mui/material';
import * as Plotly from 'plotly.js';
// const URL = "http://127.0.0.1:5000/"
const URL = "https://www.rango.run/"//#http://flask-env-5.eba-stwbput5.us-east-1.elasticbeanstalk.com/"

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

// const dataJson = {"header":["job_title","AVG(`salary`)"],"rows":[["3D Computer Vision Researcher",201162.0],["AI Scientist",229500.0],["Analytics Engineer",139192.7027027027],["Applied Data Scientist",152000.0],["Applied Machine Learning Scientist",377200.0],["Applied Scientist",172150.0],["BI Analyst",200000.0],["BI Data Analyst",1027056.0],["Big Data Architect",125000.0],["Big Data Engineer",427777.77777777775],["Business Data Analyst",259375.0],["Cloud Data Architect",250000.0],["Cloud Data Engineer",140000.0],["Computer Vision Engineer",83500.0],["Computer Vision Software Engineer",105250.0],["Data Analyst",102182.50617283951],["Data Analytics Consultant",113000.0],["Data Analytics Engineer",76400.0],["Data Analytics Lead",405000.0],["Data Analytics Manager",127134.28571428571],["Data Architect",162071.30303030304],["Data Engineer",163391.35144927536],["Data Engineering Manager",131999.83333333334],["Data Manager",125600.0],["Data Operations Analyst",73500.0],["Data Operations Engineer",80000.0],["Data Science Consultant",124444.44444444444],["Data Science Engineer",84500.0],["Data Science Lead",165000.0],["Data Science Manager",556722.1724137932],["Data Scientist",329170.94838709675],["Data Scientist Lead",183000.0],["Data Specialist",134166.66666666666],["Director of Data Engineering",141250.0],["Director of Data Science",176000.0],["ETL Developer",130947.0],["Finance Data Analyst",45000.0],["Financial Data Analyst",208333.33333333334],["Head of Data",156400.0],["Head of Data Science",146718.75],["Head of Machine Learning",6000000.0],["Lead Data Analyst",569000.0],["Lead Data Engineer",140333.33333333334],["Lead Data Scientist",590061.3333333334],["Lead Machine Learning Engineer",2548666.6666666665],["ML Engineer",1231957.142857143],["Machine Learning Developer",99000.0],["Machine Learning Engineer",213951.0128205128],["Machine Learning Infrastructure Engineer",125360.0],["Machine Learning Manager",169000.0],["Machine Learning Research Engineer",460000.0],["Machine Learning Scientist",156886.66666666666],["Marketing Data Analyst",137500.0],["NLP Engineer",140000.0],["Power BI Developer",400000.0],["Principal Data Analyst",122500.0],["Principal Data Architect",3000000.0],["Principal Data Engineer",328333.3333333333],["Principal Data Scientist",206714.2857142857],["Product Data Analyst",203333.33333333334],["Product Data Scientist",8000.0],["Research Scientist",109644.95],["Staff Data Scientist",105000.0]]}
// const dataColumns = [{name:"job_title", selector:"job_title"}, {name:"AVG(`salary`)", selector:"AVG(`salary`)"}]
// const dataRows = dataJson["rows"].map(row => ({job_title: row[0], "AVG(`salary`)": row[1]}))

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
    <Grid container>
      <Grid item xs={5}>
        <Tabs sx={{mb: 1}} value={queryMode} onChange={(event) => {setQueryMode(queryMode == 0? 1 : 0)}}>
          <Tab label="Neural Plot" />
          <Tab label="Neural Table" />
        </Tabs>
        <Grid container>
          <Grid item sx={{mb:2.5}}>
            <TextField 
              id="outlined-basic" 
              sx={{width: 500}}
              label={queryMode == 0? "Plot Query" : "Table Query"}
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
                        {queryMode == 0? 'Plot' : 'Tabulate'}
                      </Button>
                    )
                }
              }
            />
          </Grid>
        </Grid>
        <FormControl sx={{height:75, minHeight: 75, minWidth: 300}}>
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
            {/* <MenuItem value={"crypto_tweets.csv"}>Crypto Tweets</MenuItem> */}
            <MenuItem value={"airbnb_listings.csv"}>Airbnb Listings in Boston</MenuItem>
            <MenuItem value={"scooby.csv"}>Scooby Doo Episodes</MenuItem>
            <MenuItem value={"series.csv"}>Thriller, Crime, and Action Series</MenuItem>
            {/* <MenuItem value={"financial_sample.xlsx"}>Sample Financials</MenuItem> */}
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
          <DataTable
            pagination
            noHeader={true}
            highlightOnHover
            columns={columns}
            data={data}
          />
        </Grid>
      </Grid>
      <Grid item xs={7} sx={{mt:5, pl: 2}}>
        {
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
        <Grid item sx={{mt:3}}>
          {queryMode == 0 && <div style={{width: 750, height: 750}} id="graph-div"/>}
          {queryMode == 1 && 
             <Grid sx={{mt:21.85, ml: 1}}>
              <DataTable
                pagination
                noHeader={true}
                highlightOnHover
                columns={tableColumns}
                data={tableRows}
              />
            </Grid>
          }
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
