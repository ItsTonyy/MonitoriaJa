import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import './appNavBar.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store.js';
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
import NotificacaoCard from './Notificacoes/NotificacaoCard';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import logo from '/logoMonitoriaJá.png';
import anonUser from '/anon-user.avif';

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

const settings = ['Perfil', 'Histórico', 'Logout'];

export default function AppNavBar() {
  const [open, setOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  function handleClickHome() {
    navigate('/MonitoriaJa');
  }

  function handleClickMonitores() {
    navigate('/MonitoriaJa/lista-monitores');
  }

  function handleClickAgendamento() {
    navigate('/MonitoriaJa/lista-agendamentos');
  }

  function handleClickLogin() {
    navigate('/MonitoriaJa/login');
  }



  function handleClickPerfil() {}

  function handleClickHistorico() {}

  function handleClickLogout() {}

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
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
            <Box
              sx={{ display: { xs: 'none', md: 'flex' }, padding: 0 }}
              className="box-header-main"
            >
              <Box>
                <img
                  src={logo}
                  alt="logoMonitoriaJá"
                  className="logo-img"
                />
              </Box>

              <Button
                variant="text"
                color="info"
                size="small"
                sx={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  ':hover': { transform: 'none' },
                }}
                onClick={handleClickHome}
              >
                Home
              </Button>

              <Button
                variant="text"
                color="info"
                size="small"
                sx={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  ':hover': { transform: 'none' },
                }}
                onClick={handleClickMonitores}
              >
                Monitores
              </Button>

              <Button
                variant="text"
                color="info"
                size="small"
                sx={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  ':hover': { transform: 'none' },
                }}
                onClick={handleClickAgendamento}
              >
                Agendamento
              </Button>

              <Button
                variant="text"
                color="info"
                size="small"
                sx={{
                  paddingLeft: '10px',
                  paddingRight: '10px',
                  ':hover': { transform: 'none' },
                }}
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
            {isAuthenticated && <NotificacaoCard />}
            {!isAuthenticated ? (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  sx={{ ':hover': { transform: 'none' } }}
                  onClick={handleClickLogin}
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  sx={{ ':hover': { transform: 'none' } }}
                  onClick={handleClickLogin}
                >
                  Sign up
                </Button>
              </>
            ) : (
              <Button
                color="primary"
                variant="outlined"
                size="small"
                sx={{ ':hover': { transform: 'none' } }}
                onClick={handleClickLogout}
              >
                Logout
              </Button>
            )}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Anonymous User" src={anonUser} />
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
                <MenuItem onClick={handleClickPerfil}>
                  <Typography sx={{ textAlign: 'center' }}>Perfil</Typography>
                </MenuItem>
                <MenuItem onClick={handleClickHistorico}>
                  <Typography sx={{ textAlign: 'center' }}>Histórico</Typography>
                </MenuItem>
                <MenuItem onClick={handleClickLogout}>
                  <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <NotificacaoCard />
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

                <MenuItem onClick={handleClickHome}>Home</MenuItem>
                <MenuItem onClick={handleClickMonitores}>Monitores</MenuItem>
                <MenuItem onClick={handleClickAgendamento}>Agendamento</MenuItem>
                <MenuItem>Dashboard</MenuItem>
                <MenuItem>Sobre Nós</MenuItem>
                <Divider sx={{ my: 3 }} />
                {!isAuthenticated && (
                  <>
                    <MenuItem>
                      <Button color="primary" variant="contained" fullWidth onClick={handleClickLogin}>
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button color="primary" variant="outlined" fullWidth onClick={handleClickLogin}>
                        Sign in
                      </Button>
                    </MenuItem>
                  </>
                )}
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
