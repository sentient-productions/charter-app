import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { NAME } from './constants';
import SettingsIcon from '@mui/icons-material/Settings';

const pages = []
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Footer() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    // <AppBar position='static' style={{  bottom: 0, width: '100%', height:"70px", background: '#080808' }}>
    <AppBar color="primary" sx={{ top: 'auto', bottom: 0, background: '#080808' }}>
        <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}/>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}/>
          <Box sx={{ flexGrow: 0 }} style={{maxWidth:400}}>
          <Typography
            variant="caption"
          >
            {`Mobius is a demo powered by OpenAI Codex and is not yet a production ready tool. Please do not upload any sensitive data.`}
            {/* //  Mobius is not liable for content displayed or generated. Contact us on Twitter, Discord, or at support@mobius.ninja.`}     */}
          </Typography>

            {/* <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box> 
         
        </Toolbar>
      </Container>
    </AppBar>
  );
}
// import * as React from 'react';
// import Box from '@mui/material/Box';
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import RestoreIcon from '@mui/icons-material/Restore';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import LocationOnIcon from '@mui/icons-material/LocationOn';

// export default function Footer() {
//   const [value, setValue] = React.useState(0);

//   return (
//       <BottomNavigation
//         showLabels
//         value={value}
//         onChange={(event, newValue) => {
//           setValue(newValue);
//         }}
//         style={{  position: 'fixed', bottom: 0, width: '100%' }}
//       >
//         <BottomNavigationAction label="Recents" />
//         <BottomNavigationAction label="Favorites" />
//         <BottomNavigationAction label="Nearby" />
//       </BottomNavigation>
//   );
// }