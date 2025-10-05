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
import { useDispatch, useSelector } from "react-redux";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import StarIcon from "@mui/icons-material/Star";
import { Monitor } from "../ListaMonitores";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchNotificacoes, fetchMarkAsRead } from "../../redux/notificacoes/fetch";
import { type Notificacao } from "../../services/notificacoesService";

/*interface NotificacaoCardProps {
  color: "primary";
}*/

const monitorMock: Monitor[] = [
  {
    id: 1,
    nome: "João Silva",
    materia: "Matemática",
    valor: "R$ 50/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    avaliacao: 4.9,
  },
  {
    id: 2,
    nome: "Maria Souza",
    materia: "Física",
    valor: "R$ 60/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    avaliacao: 4.8,
  },
  {
    id: 3,
    nome: "Carlos Lima",
    materia: "Química",
    valor: "R$ 55/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    avaliacao: 4.5,
  },
  {
    id: 4,
    nome: "Ana Paula",
    materia: "Biologia",
    valor: "R$ 58/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/4.jpg",
    avaliacao: 4.7,
  },
];


export default function NotificacaoCard() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Estados do Redux
  const { notificacoes, loading, error } = useSelector((state: RootState) => state.notificacoes);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const open = Boolean(anchorEl);
  const notificacaoNaoLidas = notificacoes.filter((n) => !n.lida).length;

  // Função para mapear ícones por tipo
  const getIconeByTipo = (tipo: string) => {
    switch (tipo) {
      case "cancelamento":
        return <CancelIcon color="error" />;
      case "reagendamento":
        return <CalendarMonthIcon color="primary" />;
      case "agendamento":
        return <CalendarMonthIcon color="primary" />;
      case "agendamentoConfirmado":
        return <CalendarMonthIcon color="success" />;
      case "avaliacao":
        return <StarIcon color="warning" />;
      default:
        return <CalendarMonthIcon />;
    }
  };

  // Carregar notificações quando o usuário estiver autenticado
  React.useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchNotificacoes({ 
        userId: user.id, 
        userRole: user.role 
      }));
    }
  }, [isAuthenticated, user, dispatch]);

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

  const handleNotificationClick = (notificacao: Notificacao) => {
    console.log("Clicou na notificação:", notificacao);

    // Marcar notificação como lida se não estiver lida
    if (!notificacao.lida) {
      dispatch(fetchMarkAsRead(notificacao.id));
    }

    // Passar apenas dados serializáveis (sem o ícone)
    const notificacaoData = {
      id: notificacao.id,
      tipo: notificacao.tipo,
      titulo: notificacao.titulo,
      descricao: notificacao.descricao,
      tempo: notificacao.tempo,
      lida: true, // sempre true após o clique
    };
    navigate(`/MonitoriaJa/detalhes-notificacao/${notificacao.id}`, {
      state: { notificacao: notificacaoData },
    });
    handleClose();
  };

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
                  {getIconeByTipo(notificacao.tipo)}
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
