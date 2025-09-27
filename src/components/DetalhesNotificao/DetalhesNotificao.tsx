import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Container,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";

export default function DetalhesNotificao() {
  const location = useLocation();
  const navigate = useNavigate();
  const notificacao = location.state?.notificacao;

  // Função para obter o ícone baseado no tipo
  const getIconeByTipo = (tipo: string) => {
    switch (tipo) {
      case "cancelamento":
        return <CancelIcon color="error" />;
      case "reagendamento":
        return <CalendarMonthIcon color="primary" />;
      case "agendamento":
        return <CalendarMonthIcon color="primary" />;
      case "agendamentoConfirmado":
        return <PaymentIcon color="success" />;
      case "avaliacao":
        return <StarIcon color="warning" />;
      default:
        return <CalendarMonthIcon />;
    }
  };

  // Se não há dados da notificação, mostrar uma mensagem padrão
  if (!notificacao) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Notificação não encontrada
        </Typography>
        <Typography variant="body1">
          Os detalhes da notificação não estão disponíveis.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* ========== BOTÃO VOLTAR ========== */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="text"
      >
        Voltar às notificações
      </Button>

      {/* ========== TÍTULO DA PÁGINA ========== */}
      {/* EDITE AQUI: Mude o título principal */}
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        {notificacao.titulo}
      </Typography>

      {/* ========== CARD PRINCIPAL DA NOTIFICAÇÃO ========== */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: "background.paper",
                mr: 2,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              {getIconeByTipo(notificacao.tipo)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h2">
                {notificacao.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {notificacao.tempo} • Tipo: {notificacao.tipo}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">{notificacao.descricao}</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.disabled">
              Status: {notificacao.lida ? "Lida" : "Não lida"}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* ========== CARD 2 ========== */}
      {/* EDITE AQUI: Segundo card - mude conteúdo, cores, ícones */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
              <CheckCircleIcon />
            </Avatar>
            <Box>
              {/* EDITE: Título do segundo card */}
              <Typography variant="h6" component="h2">
                Agendamento Aprovado
              </Typography>
              {/* EDITE: Subtítulo do segundo card */}
              <Typography variant="body2" color="text.secondary">
                há 1 hora
              </Typography>
            </Box>
          </Box>
          {/* EDITE: Descrição do segundo card */}
          <Typography variant="body1">
            Sua solicitação de monitoria foi aprovada. A sessão está marcada
            para quinta-feira, 17 de outubro às 16:00 na sala 205.
          </Typography>
        </CardContent>
      </Card>

      {/* ========== CARD 3 ========== */}
      {/* EDITE AQUI: Terceiro card - mude conteúdo, cores, ícones */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
              <CancelIcon />
            </Avatar>
            <Box>
              {/* EDITE: Título do terceiro card */}
              <Typography variant="h6" component="h2">
                Cancelamento Processado
              </Typography>
              {/* EDITE: Subtítulo do terceiro card */}
              <Typography variant="body2" color="text.secondary">
                há 3 horas
              </Typography>
            </Box>
          </Box>
          {/* EDITE: Descrição do terceiro card */}
          <Typography variant="body1">
            Sua monitoria de Cálculo II foi cancelada conforme solicitado. O
            valor será estornado em até 5 dias úteis.
          </Typography>
        </CardContent>
      </Card>

      {/* ========== INSTRUÇÕES DE EDIÇÃO ========== */}
      {/* REMOVA ESTE COMENTÁRIO QUANDO TERMINAR DE EDITAR */}
      {/* 
      GUIA DE EDIÇÃO RÁPIDA:
      1. Cores dos avatares: 'primary.main', 'success.main', 'error.main', 'warning.main'
      2. Ícones: Importe novos ícones de @mui/icons-material
      3. Textos: Edite os Typography dentro de cada card
      4. Espaçamentos: Mude os valores sx={{ mb: X, p: X }}
      5. Para adicionar mais cards: Copie um dos cards e cole abaixo
      */}
    </Container>
  );
}
