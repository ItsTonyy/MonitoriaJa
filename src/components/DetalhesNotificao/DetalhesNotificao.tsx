import * as React from 'react';
import { useState } from 'react';
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
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import StarIcon from '@mui/icons-material/Star';
import SchoolIcon from '@mui/icons-material/School';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LinkIcon from '@mui/icons-material/Link';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoIcon from '@mui/icons-material/Info';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

interface FormData {
  rating: number | null;
  titulo: string;
  comentario: string;
}

const MONITORES = [
  {
    id: 2,
    nome: 'Ana Silva',
    materia: 'Cálculo II',
    nota: 4.8,
    preco: 'R$ 35/h',
    especialidades: ['Derivadas', 'Integrais', 'Limites'],
  },
  {
    id: 3,
    nome: 'Pedro Santos',
    materia: 'Cálculo II',
    nota: 4.7,
    preco: 'R$ 30/h',
    especialidades: ['Funções', 'Equações Diferenciais'],
  },
];

const MATERIAIS_PREPARATORIOS = [
  { titulo: 'Lista de Exercícios - Integrais', tipo: 'PDF', tamanho: '2.1 MB' },
  { titulo: 'Resumo Teórico - Cálculo II', tipo: 'PDF', tamanho: '1.8 MB' },
  { titulo: 'Formulário Básico', tipo: 'PDF', tamanho: '0.5 MB' },
];

const DADOS_REAGENDAMENTO = {
  monitor: {
    nome: 'João Silva',
    contato: '(11) 99999-9999',
    email: 'joao.silva@email.com',
  },
  aluno: {
    nome: 'Maria Santos',
    contato: '(11) 88888-8888',
  },
  sessaoAnterior: {
    data: 'Segunda-feira, 10 de outubro',
    horario: '14h00 - 15h30',
  },
  novaSessao: {
    data: 'Quarta-feira, 12 de outubro',
    horario: '16h00 - 17h30',
    motivo: 'Conflito de horário do aluno',
  },
};

export default function DetalhesNotificao() {
  const location = useLocation();
  const navigate = useNavigate();
  const notificacao = location.state?.notificacao;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState<FormData>({
    rating: null,
    titulo: '',
    comentario: '',
  });

  const getIconeByTipo = (tipo: string) => {
    switch (tipo) {
      case 'cancelamento':
        return <CancelIcon color="error" />;
      case 'reagendamento':
        return <CalendarMonthIcon color="primary" />;
      case 'agendamento':
        return <CalendarMonthIcon color="primary" />;
      case 'agendamentoConfirmado':
        return <PaymentIcon color="success" />;
      case 'avaliacao':
        return <StarIcon color="warning" />;
      default:
        return <CalendarMonthIcon />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rating || !formData.comentario) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    console.log('Avaliação enviada:', formData);
    setFormData({ rating: null, titulo: '', comentario: '' });
    alert('Avaliação enviada com sucesso!');
  };

  if (!notificacao) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Voltar
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Notificação não encontrada
        </Typography>
        <Typography variant="body1">Os detalhes da notificação não estão disponíveis.</Typography>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        pt: { xs: 12, sm: 14, md: 16 },
        pb: 4,
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                bgcolor: 'background.paper',
                mr: 2,
                border: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              {getIconeByTipo(notificacao.tipo)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                {notificacao.titulo}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1">{notificacao.descricao}</Typography>
          <Box sx={{ mt: 2 }}></Box>
          {(notificacao.tipo == 'reagendamento' ||
            notificacao.tipo == 'agendamentoConfirmado' ||
            notificacao.tipo == 'agendamento') && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                startIcon={<CalendarMonthIcon />}
                variant="contained"
                color="primary"
                size="medium"
                onClick={() => navigate('/MonitoriaJa/lista-agendamentos')}
              >
                Visualizar agendamentos
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {!isMobile && notificacao.tipo === 'agendamento' && (
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Conheça seu monitor
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Informações sobre {MONITORES[0].nome}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 48, height: 48 }}>
                <PersonIcon />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {MONITORES[0].nome}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={4} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    4.8 (127 avaliações)
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Especialista em {MONITORES[0].materia} • 3 anos de experiência
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              <strong>Sobre:</strong> Monitor experiente com foco em metodologia prática.
              Especializado em resolver dúvidas de forma clara e objetiva.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              <strong>Horários disponíveis:</strong> Segunda a Sexta: 14h-18h
            </Typography>
          </CardContent>
        </Card>
      )}

      {!isMobile && notificacao.tipo === 'agendamentoConfirmado' && (
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <AssignmentIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                  Prepare-se para a sessão
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Materiais e próximos passos
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
              Informações da sessão
            </Typography>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Data/Hora:</strong> Quinta-feira, 15 de outubro às 16h00
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Duração:</strong> 1h30min
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LinkIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
                  Acessar sala virtual
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {!isMobile &&
        notificacao.tipo === 'reagendamento' &&
        notificacao.titulo.includes('realizado') && (
          <Card sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <AccessTimeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Novo horário confirmado
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Detalhes da sua sessão reagendada
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Horário cancelado
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                    opacity: 0.7,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1, textDecoration: 'line-through' }}>
                    <strong>Data:</strong> {DADOS_REAGENDAMENTO.sessaoAnterior.data}
                  </Typography>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                    <strong>Horário:</strong> {DADOS_REAGENDAMENTO.sessaoAnterior.horario}
                  </Typography>
                </Box>

                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Novo horário confirmado
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    mb: 2,
                    bgcolor: 'action.hover',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Nova data:</strong> {DADOS_REAGENDAMENTO.novaSessao.data}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Novo horário:</strong> {DADOS_REAGENDAMENTO.novaSessao.horario}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Motivo:</strong> {DADOS_REAGENDAMENTO.novaSessao.motivo}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Informações do Monitor
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      mr: 2,
                      width: 32,
                      height: 32,
                    }}
                  >
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {DADOS_REAGENDAMENTO.monitor.nome}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <ContactPhoneIcon fontSize="small" color="action" />
                  <Typography variant="body2">{DADOS_REAGENDAMENTO.monitor.contato}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

      {!isMobile &&
        notificacao.tipo === 'reagendamento' &&
        notificacao.titulo.includes('confirmado') && (
          <Card sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <InfoIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Informações do Aluno
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prepare-se para a sessão reagendada
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Dados do Aluno
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    <PersonIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {DADOS_REAGENDAMENTO.aluno.nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {DADOS_REAGENDAMENTO.aluno.contato}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Detalhes da Sessão
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Nova data:</strong> {DADOS_REAGENDAMENTO.novaSessao.data}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Horário:</strong> {DADOS_REAGENDAMENTO.novaSessao.horario}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  <strong>Duração:</strong> 1h30min
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Sugestões para a aula
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Revisar o conteúdo da aula cancelada
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Preparar exercícios extras como compensação
                </Typography>
                <Typography variant="body2">
                  • Confirmar se o aluno tem alguma dúvida específica
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

      {!isMobile &&
        notificacao.tipo === 'cancelamento' &&
        notificacao.titulo.includes('cancelada') && (
          <Card sx={{ mb: 3, p: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                  <CancelIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                    Sessão cancelada - Próximos passos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Informações sobre o cancelamento e ações necessárias
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Dados da Sessão Cancelada
              </Typography>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 1,
                  mb: 3,
                  bgcolor: 'action.hover',
                  opacity: 0.8,
                }}
              >
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Aluno:</strong> {DADOS_REAGENDAMENTO.aluno.nome}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Contato:</strong> {DADOS_REAGENDAMENTO.aluno.contato}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Data/Hora:</strong> {DADOS_REAGENDAMENTO.sessaoAnterior.data} às{' '}
                  {DADOS_REAGENDAMENTO.sessaoAnterior.horario.split(' - ')[0]}
                </Typography>
                <Typography variant="body2">
                  <strong>Motivo:</strong> Cancelamento por parte do aluno
                </Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                Recomendações para o Monitor
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Esse horário agora está disponível para outros alunos
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Considere entrar em contato com o aluno para reagendar
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  • Mantenha seu material preparado para futuras sessões
                </Typography>
                <Typography variant="body2">
                  • Não será descontado valor por esse cancelamento
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

      {!isMobile && notificacao.tipo == 'avaliacao' && (
        <Card sx={{ mb: 3, p: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: 'background.paper',
                  mr: 2,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <SchoolIcon color="warning" />
              </Avatar>
              <Box>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
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
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                  Sua nota *
                </Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={(_, newValue) => setFormData((prev) => ({ ...prev, rating: newValue }))}
                  size="large"
                />
              </Box>

              <TextField
                fullWidth
                label="Título do seu comentário (opcional)"
                placeholder="Ex: Ótima monitoria, gostei bastante!"
                value={formData.titulo}
                onChange={(e) => setFormData((prev) => ({ ...prev, titulo: e.target.value }))}
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

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ borderRadius: 'none' }}
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
                    backgroundColor: 'var(--cor-primaria)',
                    '&:hover': { backgroundColor: 'var(--cor-secundaria)' },
                    borderRadius: 'none',
                  }}
                >
                  Enviar avaliação
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
}
