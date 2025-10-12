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

import ModalAcessar from "./ModalAcessar";
import ModalRemarcar from "./ModalRemarcar";
import ModalCancelamento from "./ModalCancelamento";
import { Agendamento } from "./models/agendamento.model";
import { MONITORES } from "./ListaMonitores";

const AGENDAMENTOS: Agendamento[] = [
  {
    id: 1,
    monitor: MONITORES[0],
    data: "12/09/2025",
    hora: "14h",
  },
  {
    id: 2,
    monitor: MONITORES[1],
    data: "15/09/2025",
    hora: "10h",
  },
  {
    id: 3,
    monitor: MONITORES[2],
    data: "20/09/2025",
    hora: "16h",
  },
  {
    id: 4,
    monitor: MONITORES[3],
    data: "22/09/2025",
    hora: "09h",
  },
  {
    id: 5,
    monitor: MONITORES[4],
    data: "12/09/2025",
    hora: "14h",
  },
  {
    id: 6,
    monitor: MONITORES[5],
    data: "15/09/2025",
    hora: "10h",
  },
  {
    id: 7,
    monitor: MONITORES[6],
    data: "20/09/2025",
    hora: "16h",
  },
  {
    id: 8,
    monitor: MONITORES[7],
    data: "22/09/2025",
    hora: "09h",
  },
  {
    id: 9,
    monitor: MONITORES[8],
    data: "12/09/2025",
    hora: "14h",
  },
  {
    id: 10,
    monitor: MONITORES[9],
    data: "15/09/2025",
    hora: "10h",
  },
  {
    id: 11,
    monitor: MONITORES[10],
    data: "20/09/2025",
    hora: "16h",
  },
  {
    id: 12,
    monitor: MONITORES[11],
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
  const [pagina, setPagina] = useState(1);
  const [cardsPorPagina, setCardsPorPagina] = useState(getCardsPerPage());
  const [modalCancelamentoOpen, setModalCancelamentoOpen] = useState(false);
  const [modalRemarcarOpen, setModalRemarcarOpen] = useState(false);
  const [modalAcessarOpen, setModalAcessarOpen] = useState(false);
  const [agendamentoSelecionado, setAgendamentoSelecionado] =
    useState<Agendamento | null>(null);
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
                      image={agendamento.monitor!.foto}
                      alt={`Foto de ${agendamento.monitor!.nome}`}
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
                      {agendamento.monitor!.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: "0.9rem",
                        color: "text.secondary",
                      }}
                    >
                      {agendamento.monitor!.materia}
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
                        onClick={() => {
                          setAgendamentoSelecionado(agendamento);
                          setModalCancelamentoOpen(true);
                        }}
                        sx={{
                          bgcolor: "#e53e3e !important",
                          "&:hover": { bgcolor: "#a81d1d !important" },
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => {
                          setAgendamentoSelecionado(agendamento);
                          setModalRemarcarOpen(true);
                        }}
                        sx={{
                          bgcolor: "#6b7280 !important",
                          "&:hover": { bgcolor: "#374151 !important" },
                        }}
                      >
                        Reagendar
                      </Button>
                      <Button
                        size="medium"
                        variant="contained"
                        onClick={() => {
                          setAgendamentoSelecionado({
                            ...agendamento,
                            link: "https://meet.google.com/zyw-jymr-ipg", // Substitua pelo link real
                          });
                          setModalAcessarOpen(true);
                        }}
                        sx={{
                          bgcolor: "#2d5be3 !important",
                          "&:hover": { bgcolor: "#1b3e8a !important" },
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
      {/* Modais */}
      {/*agendamentoSelecionado && (
        <>
          <ModalCancelamento
            open={modalCancelamentoOpen}
            onClose={() => setModalCancelamentoOpen(false)}
            onConfirm={(motivo) => {
              // Lógica para cancelar o agendamento
              setModalCancelamentoOpen(false);
            }}
          />
          <ModalRemarcar
            open={modalRemarcarOpen}
            onClose={() => setModalRemarcarOpen(false)}
            agendamento={agendamentoSelecionado}
            onRemarcar={(novaData, novoHorario) => {
              // Lógica para remarcar o agendamento
              setModalRemarcarOpen(false);
            }}
          />
          <ModalAcessar
            open={modalAcessarOpen}
            onClose={() => setModalAcessarOpen(false)}
            agendamento={{
              ...agendamentoSelecionado,
              link:
                agendamentoSelecionado.link ??
                "https://meet.google.com/zyw-jymr-ipg",
            }}
          />
        </>
      )*/}
    </Paper>
  );
}

export default ListaAgendamentos;
