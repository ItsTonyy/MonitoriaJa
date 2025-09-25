import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import './appNavBar.css';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// @ts-ignore
import ColorModeIconDropdown from '../templates/ColorModeIconDropdown.jsx';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0, padding: 0 }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, padding: 0 }}>
              <Box>
                <img
                  src="src/assets/logoMonitoriaJá-SomenteGlobo.png"
                  alt="logoMonitoriaJá"
                  className="logo-img"
                />
              </Box>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ paddingLeft: '10px', paddingRight: '10px', ':hover': { transform: 'none' } }}
              >
                Home
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ paddingLeft: '10px', paddingRight: '10px', ':hover': { transform: 'none' } }}
              >
                Monitores
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ paddingLeft: '10px', paddingRight: '10px', ':hover': { transform: 'none' } }}
              >
                Agendamento
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{ paddingLeft: '10px', paddingRight: '10px', ':hover': { transform: 'none' } }}
              >
                Dashboard
              </Button>
              <Button
                variant="text"
                color="info"
                size="small"
                sx={{
                  minWidth: 0,
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  ':hover': { transform: 'none' },
                }}
              >
                Sobre Nós
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button
              color="primary"
              variant="text"
              size="small"
              sx={{ ':hover': { transform: 'none' } }}
            >
              Sign in
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              sx={{ ':hover': { transform: 'none' } }}
            >
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                <MenuItem>Home</MenuItem>
                <MenuItem>Monitores</MenuItem>
                <MenuItem>Agendamento</MenuItem>
                <MenuItem>Dashboard</MenuItem>
                <MenuItem>Sobre Nós</MenuItem>
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button color="primary" variant="contained" fullWidth>
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button color="primary" variant="outlined" fullWidth>
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
