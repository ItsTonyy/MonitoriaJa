import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import "./appNavBar.css";
import { useNavigate } from "react-router-dom";
import { isAuthenticated as isAuth, getUserIdFromToken, decodeToken, getToken } from '../pages/Pagamento/Cartao/CadastraCartao/authUtils.js';
import { usuarioService } from "../services/usuarioService";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// @ts-ignore
import ColorModeIconDropdown from "../templates/ColorModeIconDropdown.js";
import NotificacaoCard from "./Notificacoes/NotificacaoCard.js";
import Menu from "@mui/material/Menu";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import logo from "/logoMonitoriaJá.png";
import anonUser from "/anon-user.avif";

 

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: "blur(24px)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: "8px 12px",
}));

const settings = ["Perfil", "Histórico", "Logout"];

interface IUser {
  id?: number;
  nome?: string;
  email?: string;
  tipoUsuario?: "ALUNO" | "ADMIN" | "MONITOR"; // Remover o ?
  description?: string;
  telefone?: string;
}

export default function AppNavBar() {
  const [open, setOpen] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [avatarUrl, setAvatarUrl] = React.useState<string | undefined>(undefined);

  const navigate = useNavigate();
  const isAuthenticated = isAuth();

  React.useEffect(() => {
    const loadUserAvatar = async () => {
      try {
        const id = getUserIdFromToken();
        if (!id) return;
        const user = await usuarioService.getById(String(id));
        setAvatarUrl(user?.foto || undefined);
      } catch {}
    };
    if (isAuthenticated) {
      loadUserAvatar();
    } else {
      setAvatarUrl(undefined);
    }
  }, [isAuthenticated]);

  function handleClickHome() {
    navigate("/MonitoriaJa");
  }

  function handleClickMonitores() {
    if (isAuthenticated) {
      navigate("/MonitoriaJa/lista-monitores");
    }
  }

  function handleClickAgendamento() {
    if (isAuthenticated) {
      navigate("/MonitoriaJa/lista-agendamentos");
    }
  }
  function handleClickListarUsuarios() {
    if (isAuthenticated) {
      navigate("/MonitoriaJa/listar-usuarios");
    }
  }
  function handleClickAdicionarAgendamento() {
    if (isAuthenticated) {
      navigate("/MonitoriaJa/adiciona-disciplina");
    }
  }

  function handleClickLogin() {
    navigate("/MonitoriaJa/login");
  }
  const token = getToken()
  const decodedToken = token ? decodeToken(token) : null;
  const userType = decodedToken?.role;
  function handleClickPerfil() {
    try {
      const token = getToken()
      if (!token) {
        navigate("/MonitoriaJa/perfil-usuario");
        return;
      }
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        navigate("/MonitoriaJa/perfil-usuario");
        return;
      }
      const userType = decodedToken.role;
      const isMonitorOrAdmin: boolean = 
        userType === "MONITOR" || 
        userType === "ADMIN";

      if (isMonitorOrAdmin) {
        navigate("/MonitoriaJa/perfil-monitor");
      } else {
        navigate("/MonitoriaJa/perfil-usuario");
      }

    } catch (error) {
      console.error('Erro ao verificar perfil:', error);
      navigate("/MonitoriaJa/perfil-usuario");
    }
  }

  const isAdmin:boolean = userType === "ADMIN";

  function handleClickHistorico() {
    if (isAuthenticated) {
      navigate("/MonitoriaJa/historico-agendamento");
    }
  }

  async function handleClickLogout(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    localStorage.clear();
    navigate("/MonitoriaJa/login");
  }

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

  var autenticado = localStorage.getItem('token');

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        mt: "calc(var(--template-frame-height, 0px) + 28px)",
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              px: 0,
              padding: 0,
            }}
          >
            <Box
              sx={{ display: { xs: "none", md: "flex" }, padding: 0 }}
              className="box-header-main"
            >
              <Box>
                <img src={logo} alt="logoMonitoriaJá" className="logo-img" />
              </Box>

              <Button
                variant="text"
                color="info"
                size="small"
                sx={{
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  ":hover": { transform: "none" },
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
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  ":hover": { transform: "none" },
                }}
                onClick={handleClickMonitores}
              >
                Monitores
              </Button>
              {autenticado && 
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    ":hover": { transform: "none" },
                  }}
                  onClick={handleClickAgendamento}
                >
                  Agendamento
                </Button>
              }
              {isAdmin && 
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    ":hover": { transform: "none" },
                  }}
                  onClick={handleClickListarUsuarios}
                >
                  
                  Usuarios
                </Button>
              }
              {isAdmin && 
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    ":hover": { transform: "none" },
                  }}
                  onClick={handleClickAdicionarAgendamento}
                >
                  +Disciplinas
                </Button>
              }
              {isAdmin && 
                <Button
                  variant="text"
                  color="info"
                  size="small"
                  sx={{
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    ":hover": { transform: "none" },
                  }}
                  onClick={handleClickHistorico}
                >
                  Historico
                </Button>
              }
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 1,
              alignItems: "center",
            }}
          >
            {isAuthenticated && <NotificacaoCard />}
            {!isAuthenticated ? (
              <>
                <Button
                  color="primary"
                  variant="text"
                  size="small"
                  sx={{ ":hover": { transform: "none" } }}
                  onClick={handleClickLogin}
                >
                  Sign in
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  sx={{ ":hover": { transform: "none" } }}
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
                sx={{ ":hover": { transform: "none" } }}
                onClick={handleClickLogout}
              >
                Logout
              </Button>
            )}
            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated && (
                <div>
                  <IconButton onClick={handleClickPerfil} sx={{ p: 0 }}>
                    <Avatar alt="User" src={avatarUrl || anonUser} />
                  </IconButton>
                </div>
              )}
            </Box>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
            <NotificacaoCard />
            <Box sx={{ flexGrow: 0 }}>
              {isAuthenticated && (
                <>
                  <IconButton onClick={handleClickPerfil} sx={{ p: 0 }}>
                    <Avatar alt="User" src={avatarUrl || anonUser} />
                  </IconButton>
                </>
              )}

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleClickPerfil}>
                  <Typography sx={{ textAlign: "center" }}>Perfil</Typography>
                </MenuItem>
                <MenuItem onClick={handleClickHistorico}>
                  <Typography sx={{ textAlign: "center" }}>
                    Histórico
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: "var(--template-frame-height, 0px)",
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: "background.default" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <MenuItem onClick={handleClickHome}>Home</MenuItem>
                <MenuItem onClick={handleClickMonitores}>Monitores</MenuItem>
                <MenuItem onClick={handleClickAgendamento}>
                  Agendamento
                </MenuItem>
                <Divider sx={{ my: 3 }} />
                {!isAuthenticated && (
                  <>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={handleClickLogin}
                      >
                        Sign up
                      </Button>
                    </MenuItem>
                    <MenuItem>
                      <Button
                        color="primary"
                        variant="outlined"
                        fullWidth
                        onClick={handleClickLogin}
                      >
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
