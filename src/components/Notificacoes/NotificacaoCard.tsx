import * as React from "react";
import {
  Button,
  Menu,
  Box,
  Typography,
  Avatar,
  Badge,
  Divider,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../redux/root-reducer";
import type { AppDispatch } from "../../redux/store";
import { fetchNotificacoes, markAsReadServer } from "../../redux/features/notificacoes/fetch";
import { selectAllNotificacoes } from "../../redux/features/notificacoes/slice";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";


/*interface NotificacaoCardProps {
  color: "primary";
}*/

const getIconeNotificacao = (tipo: string) => {
  switch (tipo) {
    case "reagendamento":
    case "agendamento":
    case "agendamentoConfirmado":
      return <CalendarMonthIcon color="primary" />;
    case "avaliacao":
      return <StarIcon color="warning" />;
    case "cancelamento":
      return <CancelIcon color="error" />;
    default:
      return <NotificationsIcon color="primary" />;
  }
};

export default function NotificacaoCard() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const user = useSelector((state: RootState) => state.login.user);
  const isAuthenticated = useSelector((state: RootState) => state.login.isAuthenticated);
  const notificacoes = useSelector(selectAllNotificacoes);
  const open = Boolean(anchorEl);
  const notificacaoNaoLidas = notificacoes.filter((n) => !n.lida).length;

  React.useEffect(() => {
    console.log('NotificacaoCard - user:', user);
    console.log('user.id:', user?.id, 'user.role:', user?.role);
    console.log('NotificacaoCard - notificacoes:', notificacoes);
    if (user && user.id && user.role) {
      console.log('Dispatching fetchNotificacoes with:', { userId: user.id, userRole: user.role });
      dispatch(fetchNotificacoes({ userId: user.id, userRole: user.role }));
    }
  }, [user, dispatch]);

  // Ordenar notificações: não lidas primeiro, depois por data mais recente
  const notificacoesOrdenadas = React.useMemo(() => {
    return [...notificacoes].sort((a, b) => {
      // Primeiro critério: não lidas primeiro
      if (a.lida !== b.lida) {
        return a.lida ? 1 : -1; // não lidas (false) vão para o topo
      }
      // Segundo critério: você pode adicionar ordenação por data se necessário
      return 0;
    });
  }, [notificacoes]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificacao: any) => {
    console.log("Clicou na notificação:", notificacao);

    // Marcar notificação como lida se não estiver lida
    if (!notificacao.lida) {
      dispatch(markAsReadServer(notificacao.id));
    }

    // Passar apenas dados serializáveis
    const notificacaoData = {
      id: notificacao.id,
      tipo: notificacao.tipo,
      titulo: notificacao.titulo,
      descricao: notificacao.descricao,
      tempo: notificacao.tempo,
      lida: true,
    };
    navigate(`/MonitoriaJa/detalhes-notificacao/${notificacao.id}`, {
      state: { notificacao: notificacaoData },
    });
    handleClose();
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Button
        onClick={handleClick}
        sx={{
          minWidth: "auto",
          padding: "8px",
          borderRadius: "50%",
          color: "text.primary",
        }}
      >
        <Badge badgeContent={notificacaoNaoLidas} color="error">
          <NotificationsIcon color="primary" />
        </Badge>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 380,
            maxHeight: 500,
            mt: 1,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        <Box sx={{ p: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Notificações
          </Typography>
          {notificacaoNaoLidas > 0 && (
            <Chip
              label={`${notificacaoNaoLidas} nova${
                notificacaoNaoLidas > 1 ? "s" : ""
              }`}
              size="small"
              color="primary"
              sx={{ mt: 0.5 }}
            />
          )}
        </Box>

        <Divider />

        <Box sx={{ p: 0, maxHeight: 350, overflow: "auto" }}>
          {notificacoesOrdenadas.map((notificacao, index) => (
            <Box key={notificacao.id}>
              <Box
                onClick={(e) => {
                  e.stopPropagation();
                  handleNotificationClick(notificacao);
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: notificacao.lida
                    ? "transparent"
                    : "action.hover",
                  "&:hover": {
                    backgroundColor: "action.selected",
                  },
                  cursor: "pointer",
                  px: 2,
                  py: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "background.paper",
                    border: "2px solid",
                    borderColor: "primary.main",
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  {getIconeNotificacao(notificacao.tipo)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      fontWeight: notificacao.lida ? "normal" : "bold",
                      mb: 0.5,
                    }}
                  >
                    {notificacao.titulo}
                  </Box>
                  <Box sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                    {notificacao.previa}
                  </Box>
                  <Box
                    sx={{
                      color: "text.disabled",
                      fontSize: "0.75rem",
                      mt: 0.5,
                    }}
                  >
                    {notificacao.tempo}
                  </Box>
                </Box>

                {!notificacao.lida && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "primary.main",
                      ml: 1,
                    }}
                  />
                )}
              </Box>

              {index < notificacoesOrdenadas.length - 1 && (
                <Divider sx={{ ml: 7 }} />
              )}
            </Box>
          ))}
        </Box>
        <Divider />
      </Menu>
    </div>
  );
}
