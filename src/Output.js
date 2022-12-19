import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import {
  Equalizer as EqualizerIcon,
  TableChart as TableChartIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import { QUERY_MODES } from './constants';

export default function Output({ state, setState }) {
  // Note, we cannot put full output in this object because
  // We find errors when the div "graph-div" is not found
  // on main web app page
  return (
    state.isExecuted && (
      <Grid>
        <Grid container direction="row" sx={{ pb: 1, display: 'flex' }}>
          <Grid item sx={{ mt: 0.75, mb: -0.75 }}>
            {state.queryMode == QUERY_MODES.PLOT ? (
              <EqualizerIcon />
            ) : (
              <TableChartIcon />
            )}
          </Grid>
          <Grid item sx={{ ml: 0.5, mt: 0.4, mb: -0.4 }}>
            <Typography variant="overline"> Output </Typography>
          </Grid>
        </Grid>
        {state.queryMode == QUERY_MODES.TABLE && state.isExecuted && (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={state.outputRows}
              columns={state.outputColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25, 50]}
              disableSelectionOnClick
              experimentalFeatures={{ newEditingApi: true }}
            />
          </Box>
        )}
      </Grid>
    )
  );
}
