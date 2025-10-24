import React, { useState } from "react";
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
import "./AvaliacaoPosAula .css";

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

const MONITOR_INFO: MonitorInfo = {
  nome: "Carlos Silva",
  materia: "Matemática - Cálculo I",
  duracao: "60 min",
  foto: "/static/images/avatar/1.jpg",
};

const AvaliacaoPosAula: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    rating: null,
    observacoes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);

      setTimeout(() => {}, 2000);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          <MonitorAvatar src={MONITOR_INFO.foto} alt="Foto do Monitor">
            {MONITOR_INFO.nome.charAt(0)}
          </MonitorAvatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {MONITOR_INFO.nome}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {MONITOR_INFO.materia}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Duração: {MONITOR_INFO.duracao}
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
