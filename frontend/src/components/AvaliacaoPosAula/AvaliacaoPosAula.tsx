import React, { useState, useEffect } from "react";
import {
  Card,
  Box,
  Typography,
  TextField,
  Avatar,
  Rating,
  Button,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { avaliacaoService } from "../../services/avaliacaoService";
import { agendamentoService } from "../../services/agendamentoService";
import {jwtDecode} from "jwt-decode";
import "./AvaliacaoPosAula .css";
import {Link as RouterLink} from "react-router-dom";
const AvaliacaoCard = styled(Card)({
  width: "100%",
  maxWidth: "none",
  padding: "6rem",
  textAlign: "center",
  borderRadius: "10px",
  boxShadow: "grey 5px 5px 10px",
  minHeight: "70vh",
});

const MonitorAvatar = styled(Avatar)({
  width: 80,
  height: 80,
  border: "3px solid var(--cor-primaria)",
});

interface MonitorInfo {
  nome: string;
  materia: string;
  duracao: string;
  foto?: string;
}

interface FormData {
  rating: number | null;
  observacoes: string;
}

const AvaliacaoPosAula: React.FC = () => {
  const navigate = useNavigate();
  const agendamento = useAppSelector((state) => state.agendamento.currentAgendamento);
  
  const [formData, setFormData] = useState<FormData>({
    rating: null,
    observacoes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validacaoErro, setValidacaoErro] = useState<string | null>(null);
  const [validando, setValidando] = useState(true);

  const monitorObj = typeof agendamento?.monitor === "object" && agendamento?.monitor !== null 
    ? agendamento.monitor 
    : undefined;

  useEffect(() => {
    const validarAgendamento = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setValidacaoErro("Você precisa estar logado para avaliar.");
        setValidando(false);
        return;
      }

      const monitorId = (monitorObj as any)?._id || (monitorObj as any)?.id;

      if (!monitorId) {
        setValidacaoErro("Informações do monitor não encontradas.");
        setValidando(false);
        return;
      }

      try {
        console.log("Validando agendamento para monitor:", monitorId);
        const response = await agendamentoService.validarAgendamento(monitorId);
        
        if (!response.temAgendamento) {
          setValidacaoErro("Você não possui um agendamento com este monitor. Apenas alunos que agendaram podem avaliar.");
          setValidando(false);
          return;
        }

        setValidando(false);
      } catch (error) {
        console.error("Erro ao validar agendamento:", error);
        setValidacaoErro("Erro ao validar seu agendamento. Tente novamente.");
        setValidando(false);
      }
    };

    if (monitorObj) {
      validarAgendamento();
    }
  }, [monitorObj]);

  const handleRatingChange = (
    _event: React.SyntheticEvent,
    newValue: number | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      rating: newValue,
    }));
  };

  const handleObservacoesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      observacoes: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rating) {
      alert("Por favor, selecione uma avaliação!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }

    let alunoId: string | undefined;
    try {
      const payload = jwtDecode<{ id: string }>(token);
      alunoId = payload?.id;
    } catch {
      alert("Token inválido. Faça login novamente.");
      return;
    }

    const monitorId = (monitorObj as any)?._id || (monitorObj as any)?.id;
    const agendamentoId = (agendamento as any)?._id || (agendamento as any)?.id;

    if (!alunoId || !monitorId) {
      alert("Informações do monitor ou aluno não encontradas.");
      return;
    }

    setIsLoading(true);

    try {
      await avaliacaoService.create({
        aluno: String(alunoId),
        monitor: String(monitorId),
        nota: formData.rating || 0,
        comentario: formData.observacoes,
        agendamento: agendamentoId ? String(agendamentoId) : undefined,
        dataAvaliacao: new Date(),
      });
      
      setSubmitSuccess(true);

      setTimeout(() => {
        navigate('/MonitoriaJa/lista-monitores');
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      alert("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (validando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Typography variant="h6">Validando agendamento...</Typography>
      </Box>
    );
  }

  if (validacaoErro) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          px: 2,
        }}
      >
        <Alert severity="error" sx={{ fontSize: "1.1rem", maxWidth: 600 }}>
          {validacaoErro}
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/MonitoriaJa/lista-monitores')}
            >
              Voltar para Lista de Monitores
            </Button>
          </Box>
        </Alert>
      </Box>
    );
  }

  if (submitSuccess) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <Alert severity="success" sx={{ fontSize: "1.2rem" }}>
          Avaliação enviada com sucesso! Redirecionando...
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "none",
        py: 4,
      }}
    >
      <AvaliacaoCard>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600, color: "var(--cor-primaria)", mb: 4 }}
        >
          Avaliação do Serviço
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
            textAlign: "left",
          }}
        >
          <MonitorAvatar src={(monitorObj as any)?.foto} alt="Foto do Monitor">
            {(monitorObj as any)?.nome?.charAt(0) || 'M'}
          </MonitorAvatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {(monitorObj as any)?.nome || 'Monitor'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {(monitorObj as any)?.materia || 'Disciplina'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duração: {agendamento?.duracao || '60'} min
            </Typography>
          </Box>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "left", fontWeight: 500 }}
            >
              Avalie aqui
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                size="large"
                emptyIcon={
                  <StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />
                }
                sx={{
                  "& .MuiRating-iconFilled": {
                    color: "#ffc107",
                  },
                  "& .MuiRating-iconHover": {
                    color: "#ffc107",
                  },
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, textAlign: "left", fontWeight: 500 }}
            >
              Observações
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Deixe suas observações aqui..."
              value={formData.observacoes}
              onChange={handleObservacoesChange}
              variant="outlined"
              disabled={isLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f9f9f9",
                  "&:hover fieldset": { borderColor: "var(--cor-primaria)" },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--cor-primaria)",
                  },
                },
              }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            disabled={isLoading || !formData.rating}
            sx={{
              mt: 2,
              py: 1.5,
              px: 4,
              backgroundColor: "primary",
              fontSize: "1.1rem",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "var(--cor-secundaria)",
                transform: "translateY(-2px)",
              },
              "&:disabled": {
                backgroundColor: "#ccc",
              },
            }}
          >
            {isLoading ? "Enviando..." : "Avaliar"}
          </Button>
        </Box>
      </AvaliacaoCard>
    </Box>
  );
};

export default AvaliacaoPosAula;
