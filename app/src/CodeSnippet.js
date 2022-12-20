import React from 'react';
import { Button, Card, Grid, Typography } from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { QUERY_MODES } from './constants';

// This component provides the code snippet for the user to copy/paste
// And to see the executed code in a clean format

export default function CodeSnippet({ state, setState }) {
  return (
    state.isExecuted && (
      <Card sx={{ pl: 2, pr: 2, pt: 1, pb: 1 }}>
        <Grid container direction="row" sx={{ display: 'flex' }}>
          <Grid item sx={{ mt: 0.75, mb: -0.75 }}>
            <CodeIcon />
          </Grid>
          <Grid item sx={{ ml: 0.5, mt: 0.4, mb: -0.4 }}>
            <Typography variant="overline"> Code </Typography>
          </Grid>
          <Grid item sx={{ flexGrow: 1 }} />
          <Grid item>
            <Button
              onClick={() => {
                setState({ ...state, showCode: !state.showCode });
              }}
            >
              {' '}
              {state.showCode == false ? 'Show' : 'Hide'}{' '}
            </Button>
          </Grid>
        </Grid>
        {state.showCode && (
          <SyntaxHighlighter
            language={state.queryMode == QUERY_MODES.PLOT ? 'python' : 'sql'}
            style={obsidian}
          >
            {state.responseCode}
          </SyntaxHighlighter>
        )}
      </Card>
    )
  );
}