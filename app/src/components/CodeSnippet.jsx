import React from 'react';
import { Button, Card, Grid, Text } from '@chakra-ui/react';
// import { Code as CodeIcon } from '@mui/icons-material';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { obsidian } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// This component provides the code snippet for the user to copy/paste
// And to see the executed code in a clean format

export default function CodeSnippet(params){ //{ state, setState }) {
  let state = {showCode: true, isExecuted: true}
  return (
    state.isExecuted && (
      <Card sx={{ pl: 2, pr: 2, pt: 1, pb: 1, }} >
        <Grid container direction="row" sx={{ display: 'flex' }}>
          <Grid item sx={{ mt: 0.75, mb: -0.75 }}>
            {/* <CodeIcon /> */}
          </Grid>
          <Grid item sx={{ ml: 0.5, mt: 2, mb: 2 }}>
            <Text variant="overline"> Internal Dialogue </Text>
          </Grid>
          <Grid item sx={{ flexGrow: 1 }} />
          {/* <Grid item>
            <Button
              onClick={() => {
                // setState({ ...state, showCode: !state.showCode });
              }}
            >
              {' '}
              {state.showCode == false ? 'Show' : 'Hide'}{' '}
            </Button>
          </Grid> */}
        </Grid>
        {state.showCode && (
          <SyntaxHighlighter
            language={'text'}
            wrapLines={true}
            wrapLongLines={true}
            style={obsidian}
          >
            {params.text}
          </SyntaxHighlighter>
        )}
      </Card>
    )
  );
}
