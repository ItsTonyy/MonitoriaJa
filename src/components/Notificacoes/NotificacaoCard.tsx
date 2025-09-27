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
import NotificationsIcon from "@mui/icons-material/Notifications";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";
import { Monitor, MONITORES } from "../ListaMonitores";

interface NotificacaoCardProps {
  color: "primary";
}

interface Notificacao {
  id: string;
  tipo:
    | "cancelamento"
    | "reagendamento"
    | "agendamento"
    | "avaliacao"
    | "agendamentoConfirmado";
  titulo: string;
  previa: string;
  descricao: string;
  tempo: string;
  lida: boolean;
  icone?: React.ReactNode;
}

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

const notificacoesMock: Notificacao[] = [
  {
    id: "1",
    tipo: "reagendamento",
    previa:
      "Olá, Aluno x! Passando pra avisar que sua aula com " +
      monitorMock[0].nome +
      " foi reagendada.",
    titulo: "Reagendamento realizado com sucesso",
    descricao:
      "Sua aula com " +
      monitorMock[0].nome +
      " foi reagendada com sucesso. Seu novo horário é: dia 21/10/2023 às 10h",
    tempo: "há 2 min",
    lida: false,
    icone: <CalendarMonthIcon color="primary" />,
  },
  {
    id: "2",
    tipo: "reagendamento",
    previa:
      "Olá, " +
      monitorMock[0].nome +
      "! Passando pra avisar que sua aula com Aluno x foi reagendada.",
    titulo: "Reagendamento confirmado",
    descricao: "A aula de Aluno x foi reagendada para dia 21/10/2023 às 10h",
    tempo: "há 1 hora",
    lida: false,
    icone: <CalendarMonthIcon color="primary" />,
  },
  {
    id: "3",
    tipo: "agendamentoConfirmado",
    previa:
      "Olá, Aluno y! Passando pra avisar que sua aula com " +
      monitorMock[2].nome +
      " foi reagendada.",
    titulo: "Aula confirmada",
    descricao:
      "Sua aula com " +
      monitorMock[2].nome +
      " foi confirmada. O horário selecionado foi: dia 10/10/2023 às 17h.",
    tempo: "há 3 horas",
    lida: true,
    icone: <CalendarMonthIcon color="primary" />,
  },
  {
    id: "4",
    tipo: "avaliacao",
    previa:
      "Fala, Aluno y! Conta com a gente um pouco da sua experiência com " +
      monitorMock[2].nome +
      "!",
    titulo: "Avalie sua experiência",
    descricao:
      "Conta pra gente como foi o serviço com " +
      monitorMock[2].nome +
      '! Clique em "Avaliar" para deixar seu feedback!',
    tempo: "há 1 dia",
    lida: true,
    icone: <StarIcon color="warning" />,
  },
];

export default function NotificacaoCard() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const notificacaoNaoLidas = notificacoesMock.filter((n) => !n.lida).length;
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notificacao: Notificacao) => {
    console.log("Clicou na notificação:", notificacao);
    // Passar apenas dados serializáveis (sem o ícone)
    notificacao.lida = true;
    const notificacaoData = {
      id: notificacao.id,
      tipo: notificacao.tipo,
      titulo: notificacao.titulo,
      descricao: notificacao.descricao,
      tempo: notificacao.tempo,
      lida: notificacao.lida,
    };
    navigate(`/detalhes-notificacao/${notificacao.id}`, {
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
          {notificacoesMock.map((notificacao, index) => (
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
                  {notificacao.icone}
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

              {index < notificacoesMock.length - 1 && (
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
