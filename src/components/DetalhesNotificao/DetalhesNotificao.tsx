import * as React from "react";
import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Container,
  Button,
  useMediaQuery,
  useTheme,
  TextField,
  Rating,
  Divider,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import { Monitor, MONITORES } from "../ListaMonitores";
import { Link as LinkRouter } from "react-router-dom";
interface FormData {
  rating: number | null;
  titulo: string;
  comentario: string;
}

export default function DetalhesNotificao() {
  const location = useLocation();
  const navigate = useNavigate();
  const notificacao = location.state?.notificacao;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [formData, setFormData] = useState<FormData>({
    rating: null,
    titulo: "",
    comentario: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rating || !formData.comentario) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    console.log("Avaliação enviada:", formData);
    setFormData({ rating: null, titulo: "", comentario: "" });
    alert("Avaliação enviada com sucesso!");
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
    <Container
      maxWidth="md"
      sx={{
        pt: { xs: 12, sm: 14, md: 16 }, // Distância do header responsiva
        pb: 4,
        px: { xs: 2, sm: 3, md: 4 }, // Padding lateral responsivo
      }}
    >
      {/* ========== BOTÃO VOLTAR ========== */}

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
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                {notificacao.titulo}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">{notificacao.descricao}</Typography>
          <Box sx={{ mt: 2 }}></Box>
          {(notificacao.tipo == "reagendamento" ||
            notificacao.tipo == "agendamentoConfirmado" ||
            notificacao.tipo == "agendamento") && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <LinkRouter to="/lista-agendamentos">
                <Button
                  startIcon={<CalendarMonthIcon />}
                  variant="contained"
                  color="primary"
                  size="medium"
                >
                  Visualizar agendamentos
                </Button>
              </LinkRouter>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* ========== CARD 2 ========== */}
      {/* EDITE AQUI: Cards extras - só aparecem em desktop */}
      {!isMobile && notificacao.tipo !== "avaliacao" && (
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "error.main", mr: 2 }}>
                <CancelIcon />
              </Avatar>
              <Box>
                {/* EDITE: Título do card extra */}
                <Typography variant="h6" component="h2">
                  Cancelamento Processado
                </Typography>
                {/* EDITE: Subtítulo do card extra */}
                <Typography variant="body2" color="text.secondary">
                  há 3 horas
                </Typography>
              </Box>
            </Box>
            {/* EDITE: Descrição do card extra */}
            <Typography variant="body1">
              Sua monitoria de Cálculo II foi cancelada conforme solicitado. O
              valor será estornado em até 5 dias úteis.
            </Typography>
          </CardContent>
        </Card>
      )}
      {!isMobile && notificacao.tipo == "avaliacao" && (
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "background.paper",
                  mr: 2,
                  border: "2px solid",
                  borderColor: "primary.main",
                }}
              >
                <SchoolIcon color="warning" />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  Deixe sua avaliação para {MONITORES[0].nome}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Compartilhe sua experiência com outros alunos
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, fontWeight: "medium" }}
                >
                  Sua nota *
                </Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={(_, newValue) =>
                    setFormData((prev) => ({ ...prev, rating: newValue }))
                  }
                  size="large"
                />
              </Box>

              <TextField
                fullWidth
                label="Título do seu comentário (opcional)"
                placeholder="Ex: Ótima monitoria, gostei bastante!"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, titulo: e.target.value }))
                }
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Seu comentário *"
                placeholder="Deixe aqui sua opinião detalhada..."
                value={formData.comentario}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    comentario: e.target.value,
                  }))
                }
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ borderRadius: "none" }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="medium"
                  disabled={!formData.rating || !formData.comentario}
                  sx={{
                    backgroundColor: "var(--cor-primaria)",
                    "&:hover": { backgroundColor: "var(--cor-secundaria)" },
                    borderRadius: "none",
                  }}
                >
                  Enviar avaliação
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
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
