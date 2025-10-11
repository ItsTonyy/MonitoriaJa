import React, { useState } from "react";
import {
  Card,
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Modal,
  Divider,
  LinearProgress,
  IconButton,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StarIcon from "@mui/icons-material/Star";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import "./ComentariosAvaliacao.css";

const AvaliacaoCard = styled(Card)({
  width: "100%",
  maxWidth: "none",
  padding: "3rem",
  textAlign: "left",
  borderRadius: "10px",	
  minHeight: "70vh",
  "@media (max-width: 768px)": {
    padding: "2rem",
    minHeight: "auto",
  },
  "@media (max-width: 480px)": {
    padding: "1.5rem",
  },
});

const ModalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

interface Avaliacao {
  nota: number;
  autor: string;
  data: string;
  comentario: string;
  util: number;
  naoUtil: number;
}

interface FormData {
  rating: number | null;
  titulo: string;
  comentario: string;
}

const AVALIACOES: Avaliacao[] = [
  {
    nota: 5,
    autor: "Emília",
    data: "18/02/2025",
    comentario:
      "Monitoria de boa qualidade e surpreendente, ótimo custo-benefício.",
    util: 4,
    naoUtil: 0,
  },
  {
    nota: 5,
    autor: "franciscoreis",
    data: "09/02/2025",
    comentario: "Muito bom, monitor muito atencioso!",
    util: 3,
    naoUtil: 1,
  },
  {
    nota: 5,
    autor: "Carlos",
    data: "10/09/2025",
    comentario: "Excelente explicação, aprendi muito na aula de cálculo.",
    util: 2,
    naoUtil: 0,
  },
  {
    nota: 1,
    autor: "João",
    data: "01/01/2025",
    comentario: "Não gostei, monitor não apareceu na hora marcada.",
    util: 0,
    naoUtil: 5,
  },
  {
    nota: 4,
    autor: "Maria",
    data: "05/01/2025",
    comentario: "Ótimo, mas a conexão caiu algumas vezes.",
    util: 1,
    naoUtil: 0,
  },
  {
    nota: 5,
    autor: "Lucas",
    data: "15/01/2025",
    comentario: "Perfeito, recomendo a todos! Monitor muito didático.",
    util: 6,
    naoUtil: 1,
  },
  {
    nota: 5,
    autor: "Ana",
    data: "20/01/2025",
    comentario:
      "Excelente, atendeu todas as minhas expectativas. Tirei todas as dúvidas!",
    util: 2,
    naoUtil: 0,
  },
  {
    nota: 3,
    autor: "Pedro",
    data: "25/01/2025",
    comentario: "Bom, mas poderia ser melhor. Monitor foi pontual.",
    util: 1,
    naoUtil: 1,
  },
  {
    nota: 4,
    autor: "Carla",
    data: "01/02/2025",
    comentario:
      "Estou satisfeita, mas o material disponibilizado poderia ser melhor.",
    util: 3,
    naoUtil: 0,
  },
];

const ComentariosAvaliacao: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    rating: null,
    titulo: "",
    comentario: "",
  });

  const totalAvaliacoes = AVALIACOES.length;
  const somaNotas = AVALIACOES.reduce((soma, av) => soma + av.nota, 0);
  const notaMedia = (somaNotas / totalAvaliacoes).toFixed(1);

  const contagemNotas = AVALIACOES.reduce((acc, av) => {
    acc[av.nota] = (acc[av.nota] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const avaliacoesVisiveis = showMore ? AVALIACOES : AVALIACOES.slice(0, 2);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({ rating: null, titulo: "", comentario: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rating || !formData.comentario) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    console.log("Avaliação enviada:", formData);
    handleModalClose();
    alert("Avaliação enviada com sucesso!");
  };

  return (
    <Box sx={{ py: 4 }}>
      <AvaliacaoCard>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            gap: { xs: 3, md: 4 },
          }}
        >
          <Box sx={{ borderRight: { md: "1px solid #e0e0e0" }, pr: { md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 2, sm: 6 },
                mb: 4,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontWeight: "bold", color: "var(--cor-primaria)" }}
              >
                Avaliações
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleModalOpen}
                sx={{
                  backgroundColor: "primary",
                  "&:hover": { backgroundColor: "var(--cor-secundaria)" },
                  alignSelf: { xs: "flex-start", sm: "auto" },
                  px: 3,
                  py: 1,
                }}
              >
                Quero avaliar
              </Button>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="overline"
                sx={{ color: "text.secondary", fontWeight: "bold" }}
              >
                NOTA
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, sm: 2 },
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "flex-start",
                }}
              >
                <Typography
                  variant="h2"
                  sx={{ fontWeight: "bold", mr: { xs: 0, sm: 1 } }}
                >
                  {notaMedia}
                </Typography>
                <Rating
                  value={Math.round(parseFloat(notaMedia))}
                  readOnly
                  size="large"
                  sx={{
                    "& .MuiRating-icon": {
                      fontSize: { xs: "1.5rem", sm: "2rem" },
                    },
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {totalAvaliacoes} avaliações
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "text.secondary",
                  fontWeight: "bold",
                  mb: 2,
                  display: "block",
                }}
              >
                COMPOSIÇÃO DA NOTA
              </Typography>
              {[5, 4, 3, 2, 1].map((estrelas) => {
                const count = contagemNotas[estrelas] || 0;
                const porcentagem = (count / totalAvaliacoes) * 100;
                return (
                  <Box
                    key={estrelas}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 50,
                      }}
                    >
                      <Typography variant="body2">{estrelas}</Typography>
                      <StarIcon
                        sx={{ fontSize: 16, color: "#ffc107", ml: 0.5 }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={porcentagem}
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#e0e0e0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "var(--cor-primaria)",
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 50, textAlign: "right" }}
                    >
                      {porcentagem.toFixed(1)}%
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "var(--cor-primaria)" }}
              >
                Comentários
              </Typography>
              <Typography variant="body2" color="text.secondary">
                mais úteis
              </Typography>
            </Box>

            <Box>
              {avaliacoesVisiveis.map((avaliacao, index) => (
                <Box key={index}>
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 2 },
                        mb: 2,
                      }}
                    >
                      <Rating
                        value={avaliacao.nota}
                        readOnly
                        size="small"
                        sx={{
                          "& .MuiRating-icon": {
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Comentário de {avaliacao.autor}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 1, sm: 2 },
                        mb: 2,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {avaliacao.autor} em {avaliacao.data}
                      </Typography>
                      <Chip
                        icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                        label="usuário verificado"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{
                          fontSize: { xs: "0.7rem", sm: "0.8rem" },
                          height: { xs: 24, sm: 32 },
                        }}
                      />
                    </Box>

                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {avaliacao.comentario}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: { xs: "flex-start", sm: "center" },
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 2 },
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Esta avaliação foi útil?
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="medium"
                          startIcon={
                            <ThumbUpIcon
                              sx={{ fontSize: { xs: 16, sm: 18 } }}
                            />
                          }
                          sx={{
                            minWidth: "auto",
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            px: { xs: 1, sm: 2 },
                            borderRadius: "15px",
                          }}
                        >
                          ({avaliacao.util})
                        </Button>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="medium"
                          startIcon={
                            <ThumbDownIcon
                              sx={{ fontSize: { xs: 16, sm: 18 } }}
                            />
                          }
                          sx={{
                            minWidth: "auto",
                            fontSize: { xs: "0.7rem", sm: "0.8rem" },
                            px: { xs: 1, sm: 2 },
                            borderRadius: "15px",
                          }}
                        >
                          ({avaliacao.naoUtil})
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {index < avaliacoesVisiveis.length - 1 && (
                    <Divider sx={{ my: 4 }} />
                  )}
                </Box>
              ))}

              {AVALIACOES.length > 2 && (
                <Box sx={{ textAlign: "center", mt: 3 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="medium"
                    onClick={() => setShowMore(!showMore)}
                    sx={{
                      borderColor: "var(--cor-primaria)",
                      color: "var(--cor-primaria)",
                      "&:hover": {
                        borderColor: "var(--cor-secundaria)",
                        backgroundColor: "var(--cor-secundaria)",
                        color: "white",
                      },
                      borderRadius: "15px",
                    }}
                  >
                    {showMore ? "Ver menos" : "Ver mais"}
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </AvaliacaoCard>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <Box sx={ModalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Deixe sua avaliação
            </Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
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
                setFormData((prev) => ({ ...prev, comentario: e.target.value }))
              }
              sx={{ mb: 3 }}
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                color="primary"
                size="medium"
                onClick={handleModalClose}
                sx={{ borderRadius: "15px" }}
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
                  borderRadius: "15px",
                }}
              >
                Enviar avaliação
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ComentariosAvaliacao;
