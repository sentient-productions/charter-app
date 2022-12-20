import React, { useState } from 'react';
import { Box, Card, Grid, Typography } from '@mui/material';
import CodeSnippet from './CodeSnippet';
import Data from './Data';
import Footer from './Footer';
import LocalAppBar from './AppBar';
import Output from './Output';
import QueryBar from './QueryBar';
import { QUERY_MODES } from './constants';

function App() {

  // Global application state
  const [state, setState] = useState({
    dataset: 'cars.csv',
    columns: [],
    rows: [],
    raw: [],
    queryMode: QUERY_MODES.PLOT,
    showCode: true,
    isExecuted: false,
    responseCode: '',
    errorText: '',
    outputRows: [],
    outputColumns: []
  });

  return (
    <>
      <LocalAppBar />
      <Grid container alignItems="center" justifyContent="center">
        <Grid item sm={7} xs={12} sx={{ mt: 10 }}>
          <Grid item container alignItems="center" justifyContent="center">
            <Typography variant="h4" sx={{ mb: 2 }}>
              Data Explorer
            </Typography>
          </Grid>
          {/* Query Panel */}
          <Grid item sx={{ mb: 2. }}>
            <QueryBar state={state} setState={setState} />
          </Grid>
          {/* Code Snippet Panel */}
          <Grid item sx={{ mb: state.isExecuted ? 2. : 0 }}>
            <CodeSnippet state={state} setState={setState} />
          </Grid>
          {/* Output Panel */}
          <Grid item sx={{ mb: state.isExecuted ? 2. : 0 }}>
            {/* 
                  TODO - move this to it's own component
                  This was challenging b/c we need the id="graph-div" 
                  to be associated with this page to render the graph  
            */}
            <Card
              sx={
                state.isExecuted
                  ? { pl: 2, pr: 2, pt: 1, pb: 1 }
                  : { pl: 2, pr: 2 } // no height if no output, but pre-pad l+r for plot balance
              }
            >
              <Output state={state} setState={setState} />
              {/* this is the line that prevents us from putting more logic in the Output component */}
              <Box id="graph-div" />
            </Card>
          </Grid>
          {/* Dataset information */}
          <Grid item>
            <Data state={state} setState={setState} />
          </Grid>
        </Grid>
      </Grid>
      <Grid >
        <Footer />
      </Grid>
    </>
  );
}

export default App;
