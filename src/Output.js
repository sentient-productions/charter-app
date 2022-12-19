import React from 'react';
import { Grid, Typography} from '@mui/material';
import EqualizerIcon from '@mui/icons-material/Equalizer';

export default function Output({ state, setState }) {
  // Note, we cannot put full output in this object because
  // We find errors when the div "graph-div" is not found
  // on main web app page
  return state.isExecuted && 
    <Grid container direction="row" sx={{pb: 1, display: 'flex'}}>
      <Grid item sx={{mt: 0.75, mb: -0.75}}>
        <EqualizerIcon />
      </Grid>
      <Grid item sx={{ml:0.5, mt:0.4, mb:-0.4}}>
        <Typography variant="overline" > Output </Typography>
      </Grid>
    </Grid>
}
