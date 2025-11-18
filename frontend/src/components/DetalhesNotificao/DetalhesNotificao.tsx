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
  IconButton,
  Collapse,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CancelIcon from "@mui/icons-material/Cancel";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LinkIcon from "@mui/icons-material/Link";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import InfoIcon from "@mui/icons-material/Info";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

interface FormData {
  rating: number | null;
  titulo: string;
  comentario: string;
}

const MONITORES = [
  {
    id: 2,
    nome: "Ana Silva",
    materia: "Cálculo II",
    nota: 4.8,
    preco: "R$ 35/h",
    especialidades: ["Derivadas", "Integrais", "Limites"],
  },
  {
    id: 3,
    nome: "Pedro Santos",
    materia: "Cálculo II",
    nota: 4.7,
    preco: "R$ 30/h",
    especialidades: ["Funções", "Equações Diferenciais"],
  },
];

/*const MATERIAIS_PREPARATORIOS = [
  { titulo: 'Lista de Exercícios - Integrais', tipo: 'PDF', tamanho: '2.1 MB' },
  { titulo: 'Resumo Teórico - Cálculo II', tipo: 'PDF', tamanho: '1.8 MB' },
  { titulo: 'Formulário Básico', tipo: 'PDF', tamanho: '0.5 MB' },
];/*/

const DADOS_REAGENDAMENTO = {
  monitor: {
    nome: "João Silva",
    contato: "(11) 99999-9999",
    email: "joao.silva@email.com",
  },
  aluno: {
    nome: "Maria Santos",
    contato: "(11) 88888-8888",
  },
  sessaoAnterior: {
    data: "Segunda-feira, 10 de outubro",
    horario: "14h00 - 15h30",
  },
  novaSessao: {
    data: "Quarta-feira, 12 de outubro",
    horario: "16h00 - 17h30",
    motivo: "Conflito de horário do aluno",
  },
};

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

  const [expandedCard, setExpandedCard] = useState(false);

  const SecondaryCard: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => {
    return (
      <Collapse in={isMobile ? expandedCard : true} timeout="auto">
        {children}
      </Collapse>
    );
  };

  const getIconeByTipo = (tipo: string) => {
    switch (tipo) {
      case "CANCELAMENTO":
        return <CancelIcon color="error" />;
      case "REAGENDAMENTO":
        return <CalendarMonthIcon color="primary" />;
      case "AGENDAMENTO":
        return <CalendarMonthIcon color="primary" />;
      case "agendamentoConfirmado":
        return <PaymentIcon color="success" />;
      case "AVALIACAO":
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

  console.log('DetalhesNotificacao - notificacao:', notificacao);
  console.log('DetalhesNotificacao - tipo:', notificacao.tipo);
  console.log('DetalhesNotificacao - agendamento:', notificacao.agendamento);
  console.log('Condição card:', (notificacao.tipo === "AGENDAMENTO" || notificacao.tipo === "CANCELAMENTO" || notificacao.tipo === "REAGENDAMENTO") && notificacao.agendamento);

  return (
    <Container
      maxWidth="md"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
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
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                {notificacao.titulo}
              </Typography>
            </Box>
            {isMobile &&
              (notificacao.tipo === "AGENDAMENTO" ||
                notificacao.tipo === "REAGENDAMENTO" ||
                notificacao.tipo === "CANCELAMENTO" ||
                notificacao.tipo === "AVALIACAO") && (
                <IconButton
                  onClick={() => setExpandedCard(!expandedCard)}
                  size="small"
                  sx={{
                    bgcolor: "action.hover",
                    "&:hover": { bgcolor: "action.selected" },
                  }}
                >
                  {expandedCard ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
          </Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {notificacao.mensagem}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Data de envio:</strong> {notificacao.dataEnvio ? new Date(notificacao.dataEnvio).toLocaleDateString('pt-BR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Não disponível'}
          </Typography>
          <Box sx={{ mt: 2 }}></Box>
          {(notificacao.tipo == "REAGENDAMENTO" ||
            notificacao.tipo == "AGENDAMENTO") && (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                startIcon={<CalendarMonthIcon />}
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => navigate("/MonitoriaJa/lista-agendamentos")}
              >
                Visualizar agendamentos
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {(notificacao.tipo === "AGENDAMENTO" || notificacao.tipo === "CANCELAMENTO" || notificacao.tipo === "REAGENDAMENTO") && notificacao.agendamento && (
        <SecondaryCard>
          <Card sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                  <CalendarMonthIcon />
                </Avatar>
                <Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    Detalhes do Agendamento
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Informações da monitoria
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
                Monitor
              </Typography>
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <PersonIcon sx={{ mr: 1 }} fontSize="small" />
                  <Typography variant="body2">
                    <strong>Nome:</strong> {notificacao.agendamento.monitor?.nome || 'Não informado'}
                  </Typography>
                </Box>
                {notificacao.agendamento.monitor?.email && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Email:</strong> {notificacao.agendamento.monitor.email}
                  </Typography>
                )}
                {notificacao.agendamento.monitor?.telefone && (
                  <Typography variant="body2">
                    <strong>Telefone:</strong> {notificacao.agendamento.monitor.telefone}
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
                Informações da Sessão
              </Typography>
              <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Serviço:</strong> {notificacao.agendamento.servico || 'Não informado'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Data:</strong> {notificacao.agendamento.data || 'Não informada'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Horário:</strong> {notificacao.agendamento.hora || 'Não informado'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Duração:</strong> {notificacao.agendamento.duracao ? `${notificacao.agendamento.duracao} minutos` : 'Não informada'}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Status:</strong> {notificacao.agendamento.status || 'Não informado'}
                </Typography>
                {notificacao.agendamento.topicos && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Tópicos:</strong> {notificacao.agendamento.topicos}
                  </Typography>
                )}
                {notificacao.agendamento.link && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
                    <LinkIcon fontSize="small" color="primary" />
                    <Typography
                      variant="body2"
                      color="primary"
                      component="a"
                      href={notificacao.agendamento.link}
                      target="_blank"
                      sx={{ cursor: "pointer", textDecoration: 'none' }}
                    >
                      Acessar sala virtual
                    </Typography>
                  </Box>
                )}
              </Box>

              {notificacao.agendamento.valor && (
                <>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: "bold" }}>
                    Pagamento
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Valor:</strong> {notificacao.agendamento.valor}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Forma:</strong> {notificacao.agendamento.formaPagamento || 'Não informada'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Status:</strong> {notificacao.agendamento.statusPagamento || 'Não informado'}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </SecondaryCard>
      )}



      {notificacao.tipo == "AVALIACAO" && (
        <SecondaryCard>
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

                <Box
                  sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}
                >
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
        </SecondaryCard>
      )}
    </Container>
  );
}
