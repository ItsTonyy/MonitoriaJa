import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Stack,
  Grid,
  Paper,
  Box,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

type Agendamento = {
  id: number;
  nome: string;
  materia: string;
  foto: string;
  data: string;
  hora: string;
};

const AGENDAMENTOS: Agendamento[] = [
  {
    id: 1,
    nome: "João Silva",
    materia: "Matemática",
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    data: "12/09/2025",
    hora: "14h",
  },
  {
    id: 2,
    nome: "Maria Souza",
    materia: "Física",
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    data: "15/09/2025",
    hora: "10h",
  },
  {
    id: 3,
    nome: "Carlos Lima",
    materia: "Química",
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    data: "20/09/2025",
    hora: "16h",
  },
  {
    id: 4,
    nome: "Ana Paula",
    materia: "Biologia",
    foto: "https://randomuser.me/api/portraits/women/4.jpg",
    data: "22/09/2025",
    hora: "09h",
  },
  {
    id: 5,
    nome: "João Silva",
    materia: "Matemática",
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    data: "12/09/2025",
    hora: "14h",
  },
  {
    id: 6,
    nome: "Maria Souza",
    materia: "Física",
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    data: "15/09/2025",
    hora: "10h",
  },
  {
    id: 7,
    nome: "Carlos Lima",
    materia: "Química",
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    data: "20/09/2025",
    hora: "16h",
  },
  {
    id: 8,
    nome: "Ana Paula",
    materia: "Biologia",
    foto: "https://randomuser.me/api/portraits/women/4.jpg",
    data: "22/09/2025",
    hora: "09h",
  },
  {
    id: 9,
    nome: "João Silva",
    materia: "Matemática",
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    data: "12/09/2025",
    hora: "14h",
  },
  {
    id: 10,
    nome: "Maria Souza",
    materia: "Física",
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    data: "15/09/2025",
    hora: "10h",
  },
  {
    id: 11,
    nome: "Carlos Lima",
    materia: "Química",
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    data: "20/09/2025",
    hora: "16h",
  },
  {
    id: 12,
    nome: "Ana Paula",
    materia: "Biologia",
    foto: "https://randomuser.me/api/portraits/women/4.jpg",
    data: "22/09/2025",
    hora: "09h",
  },
];

function getGridCols() {
  if (typeof window === "undefined") return 2;
  const width = window.innerWidth;
  if (width >= 1200) return 3;
  if (width >= 783) return 2;
  return 1;
}

function getGridRows() {
  const alturaReservada = 350;
  const alturaCard = 180;
  const espacamentoVertical = 24;
  const alturaTotal = alturaCard + espacamentoVertical;

  const alturaDisponivel =
    typeof window !== "undefined" ? window.innerHeight - alturaReservada : 600;

  return Math.max(1, Math.floor(alturaDisponivel / alturaTotal));
}

// Altere a função getCardsPerPage
function getCardsPerPage() {
  const cols = getGridCols();
  const rows = getGridRows();
  return cols * rows;
}
function ListaAgendamentos() {
  const navigate = useNavigate();
  const [pagina, setPagina] = useState(1);
  const [cardsPorPagina, setCardsPorPagina] = useState(getCardsPerPage());

  useEffect(() => {
    function handleResize() {
      setCardsPorPagina(getCardsPerPage());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPaginas = Math.max(
    1,
    Math.ceil(AGENDAMENTOS.length / cardsPorPagina)
  );

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(1);
  }, [totalPaginas, pagina]);

  const agendamentosPagina = useMemo(
    () =>
      AGENDAMENTOS.slice(
        (pagina - 1) * cardsPorPagina,
        pagina * cardsPorPagina
      ),
    [pagina, cardsPorPagina]
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "background.default",
        maxWidth: 1200,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 500,
          color: "primary.main",
          mb: 2,
        }}
      >
        Lista de Agendamentos
      </Typography>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{
          width: "100%",
          margin: "0 auto",
        }}
      >
        {agendamentosPagina.length === 0 ? (
          <Grid item xs={12} component={"div" as unknown as React.ElementType}>
            <Typography align="center" color="text.secondary" sx={{ my: 4 }}>
              Nenhum agendamento encontrado.
            </Typography>
          </Grid>
        ) : (
          agendamentosPagina.map((agendamento) => (
            <Grid
              item
              xs={12}
              key={agendamento.id}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
              component={"div" as unknown as React.ElementType}
            >
              <Fade in timeout={500}>
                <Card
                  elevation={2}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    height: "180px",
                    width: "350px",
                    minWidth: "340px",
                    maxWidth: "350px",
                    margin: "0 auto",
                    "&:hover": {
                      elevation: 4,
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease-in-out",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100px",
                      minWidth: "100px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={agendamento.foto}
                      alt={`Foto de ${agendamento.nome}`}
                      sx={{
                        width: { xs: 70, sm: 80 },
                        height: { xs: 70, sm: 80 },
                        borderRadius: "50%",
                        border: 2,
                        borderColor: "primary.main",
                      }}
                    />
                  </Box>

                  <CardContent
                    sx={{
                      flex: 1,
                      p: 1.5,
                      overflow: "hidden",
                      "&:last-child": { pb: 1.5 },
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    {/* <Typography
                      variant="h6"
                      color="primary.main"
                      sx={{
                        fontSize: "1.1rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >*/}
                    <Typography
                      variant="h6"
                      color="primary.main"
                      sx={{
                        fontSize: "0.9rem",
                        lineHeight: 1.2,
                        maxHeight: "2.4em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        whiteSpace: "normal",
                      }}
                    >
                      {agendamento.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.secondary",
                      }}
                    >
                      {agendamento.materia}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.secondary",
                      }}
                    >
                      {agendamento.data}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.secondary",
                      }}
                    >
                      {agendamento.hora}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      p: 1.5,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      minWidth: "110px",
                      justifyContent: "center",
                    }}
                  >
                    <Stack
                      spacing={1} // Adiciona espaçamento vertical entre botões
                      sx={{
                        width: "100%",
                        minWidth: "110px",
                        "& .MuiButton-root": {
                          // Estilo comum para todos os botões
                          padding: "8px 16px",
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => navigate("/modalCancelamento")}
                        sx={{
                          bgcolor: "#e53e3e !important", // Cor original do btnCancelar
                          "&:hover": {
                            bgcolor: "#a81d1d !important",
                          },
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => navigate("/reagendamento")}
                        sx={{
                          bgcolor: "#6b7280 !important", // Cor original do btnReagendar
                          "&:hover": {
                            bgcolor: "#374151 !important",
                          },
                        }}
                      >
                        Reagendar
                      </Button>
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => navigate("/avaliacao")}
                        sx={{
                          bgcolor: "#2d5be3 !important", // Cor original do btnAcessar
                          "&:hover": {
                            bgcolor: "#1b3e8a !important",
                          },
                        }}
                      >
                        Acessar
                      </Button>
                    </Stack>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))
        )}
      </Grid>

      <Stack spacing={1} direction="row" justifyContent="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          disabled={pagina === 1}
        >
          &#8592;
        </Button>
        <Typography
          variant="body1"
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
          }}
        >
          {pagina} de {totalPaginas}
        </Typography>
        <Button
          variant="contained"
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas}
        >
          &#8594;
        </Button>
      </Stack>
    </Paper>
  );
}

export default ListaAgendamentos;