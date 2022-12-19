import React, { useState } from 'react';
import {Box, Card,  Grid} from '@mui/material';
import CodeSnippet from './CodeSnippet';
import Data from './Data';
import Output from './Output';
import QueryBar from './QueryBar';
import {QUERY_MODES} from './constants';

function App() {
  // Global application state
  const [state, setState] = useState(
    { 
      dataset: "salaries.csv",
      columns: [], 
      rows: [], 
      raw: [], 
      queryMode: QUERY_MODES.PLOT, 
      showCode: false, 
      isExecuted: false, 
      responseCode: ""
    }
  );

  return (
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={8} sx={{mt:10}}>
          {/* Query Panel */}
          <Grid item sx={{mb:2.5}}>
            <QueryBar state={state} setState={setState}/>
          </Grid>
          {/* Code Snippet Panel */}
          <Grid item sx={{mb: state.isExecuted? 2.5: 0}}>
            <CodeSnippet state={state} setState={setState}/>
          </Grid>
          {/* Output Panel */}
          <Grid item sx={{mb: state.isExecuted? 2.5: 0}}>
              {/* 
                TODO - move this to it's own component
                This was challenging b/c we need the id="graph-div" 
                to be associated with this page to render the graph  
              */}
              <Card sx={state.isExecuted? {pl:2, pr: 2, pt: 1, pb: 1}: {pl:2, pr: 2}}>
                <Output state={state} setState={setState}/>
                <Box id="graph-div"/>
              </Card>
          </Grid>
          {/* Dataset information */}
          <Grid item>
            <Data state={state} setState={setState}/>
          </Grid>
        </Grid>
      </Grid>
  );
}

export default App;
