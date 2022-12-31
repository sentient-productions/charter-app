import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { NAME } from './constants';

export default function Footer() {

  return (
    <AppBar color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} />
          <Box sx={{ flexGrow: 0 }} style={{ maxWidth: 400 }}>
            <Typography variant="caption">
              {`${NAME} is a demo powered by OpenAI Codex and is not yet a production ready tool. Please do not upload any large or sensitive data.`}
              {/* //  Mobius is not liable for content displayed or generated. Contact us on Twitter, Discord, or at support@mobius.ninja.`}     */}
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}