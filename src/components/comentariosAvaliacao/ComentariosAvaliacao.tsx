import React, { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  buscarAvaliacoesPorMonitor,
  criarAvaliacao,
} from "../../redux/features/avaliacao/actions";

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

// Avaliações são fornecidas pelo Redux (interface em redux/features/avaliacao/fetch.ts)

interface FormData {
  rating: number | null;
  titulo: string;
  comentario: string;
}

// Dados de avaliações removidos; serão carregados do Redux via busco por monitorId

const ComentariosAvaliacao: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    rating: null,
    titulo: "",
    comentario: "",
  });
  const dispatch = useAppDispatch();
  const monitor = useAppSelector((state) => state.monitor.selectedMonitor);
  const { avaliacoes, loading } = useAppSelector((state) => state.avaliacao);
  const usuarioLogado = useAppSelector((state) => state.login.user);

  useEffect(() => {
    if (monitor?.id) {
      dispatch(buscarAvaliacoesPorMonitor(Number(monitor.id)));
    }
  }, [monitor?.id, dispatch]);

  const totalAvaliacoes = avaliacoes.length;
  const somaNotas = avaliacoes.reduce((soma, av) => soma + (av.nota || 0), 0);
  const notaMedia =
    totalAvaliacoes > 0 ? (somaNotas / totalAvaliacoes).toFixed(1) : "0.0";

  const contagemNotas = avaliacoes.reduce((acc, av) => {
    const n = av.nota || 0;
    acc[n] = (acc[n] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const avaliacoesVisiveis = showMore ? avaliacoes : avaliacoes.slice(0, 2);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setFormData({ rating: null, titulo: "", comentario: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.rating || !formData.comentario) {
      alert("Por favor, preencha todos os campos obrigatórios!");
      return;
    }
    if (!usuarioLogado?.id || !monitor?.id) {
      alert("Você precisa estar logado e selecionar um monitor para avaliar.");
      return;
    }
    await dispatch(
      criarAvaliacao({
        usuarioId: usuarioLogado.id,
        monitorId: monitor.id,
        nota: formData.rating,
        comentario: formData.comentario,
      })
    );
    handleModalClose();
    alert("Avaliação enviada com sucesso!");
    dispatch(buscarAvaliacoesPorMonitor(Number(monitor.id)));
  };

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>Carregando avaliações...</Typography>
      </Box>
    );
  }

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
                const porcentagem =
                  totalAvaliacoes > 0 ? (count / totalAvaliacoes) * 100 : 0;
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
                        value={avaliacao.nota || 0}
                        readOnly
                        size="small"
                        sx={{
                          "& .MuiRating-icon": {
                            fontSize: { xs: "1rem", sm: "1.2rem" },
                          },
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Comentário de Usuário #{avaliacao.usuarioId ?? "N/A"}
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
                        Usuário #{avaliacao.usuarioId ?? "N/A"} em{" "}
                        {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
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
                          ({0})
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
                          ({0})
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {index < avaliacoesVisiveis.length - 1 && (
                    <Divider sx={{ my: 4 }} />
                  )}
                </Box>
              ))}

              {avaliacoes.length > 2 && (
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
