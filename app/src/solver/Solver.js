import React, { useState } from 'react';
import { Box, Card, Grid, Typography } from '@mui/material';
import Data from './Data';
import Footer from '../Footer';
import LocalAppBar from '../AppBar';
import Output from './Output';
import QueryBar from './QueryBar';
import { QUERY_MODES } from '../constants';

function Solver() {
  // Global Wranglerlication state
  const [state, setState] = useState({});

  return (
    <>
      <LocalAppBar />
      <Grid container alignItems="center" justifyContent="center">
        <Grid item sm={7} xs={12} sx={{ mt: 7 }}>
          <Grid item container alignItems="center" justifyContent="center">
            <Typography variant="h4" sx={{ mb: 3 }}>
              xx Solver xx
            </Typography>
          </Grid>
          {/* Query Panel */}
          <Grid item sx={{ mb: 2 }}>
            {/* <QueryBar state={state} setState={setState} /> */}
          </Grid>
        </Grid>
      </Grid>
      <Grid>
        <Footer />
      </Grid>
    </>
  );
}

export default Solver;
