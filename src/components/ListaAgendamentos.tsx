import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import styles from "./ListaAgendamentos.module.css";

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
];


function getCardsPerPage() {
  const alturaReservada = 250;
  const alturaCard = 200;
  const alturaDisponivel =
    typeof window !== "undefined" ? window.innerHeight - alturaReservada : 600;
  return Math.max(1, Math.floor(alturaDisponivel / alturaCard));
}

function ListaAgendamentos() {
  const [pagina, setPagina] = useState(1);
  const [cardsPorPagina, setCardsPorPagina] = useState(getCardsPerPage());
  const title= "Lista de Agendamentos";
  const nenhumAgendamentoMsg = "Nenhum agendamento encontrado.";

  useEffect(() => {
    function handleResize() {
      setCardsPorPagina(getCardsPerPage());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(AGENDAMENTOS.length / cardsPorPagina));

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
    <Box className={styles.container}>
      <Typography variant="h4" align="center" gutterBottom>
        {title}
      </Typography>
      <main className={styles.listaAgendamentos}>
        <Grid
          container
          direction="column"
          spacing={4}
          justifyContent="center"
          className={styles.rowAgendamentos}
        >
          {agendamentosPagina.length === 0 ? (
            <Grid item xs={12}
            component={"div" as unknown as React.ElementType}>
              <Typography align="center" color="text.secondary">
                {nenhumAgendamentoMsg}
              </Typography>
            </Grid>
          ) : (
            agendamentosPagina.map((agendamento) => (
              <Grid
                item
                xs={12}
                key={agendamento.id}
                style={{ display: "flex" }}
                component={"div" as unknown as React.ElementType}
              >
                <div className={styles.agendamentoCard}>
                  <div className={styles.agendamentoImgAvaliacao}>
                    <CardMedia
                      component="img"
                      image={agendamento.foto}
                      alt={`Foto de ${agendamento.nome}`}
                      className={styles.agendamentoFoto}
                    />
                  </div>
                  <CardContent className={styles.agendamentoInfo}>
                    <Typography
                      variant="h6"
                      className={styles.agendamentoNome}
                      color="primary"
                    >
                      {agendamento.nome}
                    </Typography>
                    <Typography
                      variant="body1"
                      className={styles.agendamentoMateria}
                    >
                      {agendamento.materia}
                    </Typography>
                    <Typography
                      variant="body2"
                      className={styles.agendamentoDataHora}
                      sx={{ mt: 1 }}
                    >
                      <span className={styles.agendamentoData}>
                        {agendamento.data}
                      </span>{" "}
                      &bull;{" "}
                      <span className={styles.agendamentoHora}>
                        {agendamento.hora}
                      </span>
                    </Typography>
                  </CardContent>
                  <Box className={styles.agendamentoBotoes}>
                    <Button
                      variant="contained"
                      color="error"
                      className={styles.btnCancelar}
                      onClick={() =>
                        window.location.href = "../modalCancelamento/index.html"
                      }
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={styles.btnReagendar}
                      onClick={() =>
                        window.location.href = "../frontend2/reagendamento/index.html"
                      }
                    >
                      Reagendar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className={styles.btnAcessar}
                      onClick={() =>
                        window.location.href = "../frontend/avaliacao/index.html"
                      }
                    >
                      Acessar
                    </Button>
                  </Box>
                </div>
              </Grid>
            ))
          )}
        </Grid>
      </main>
      {}
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} className={styles.paginacao}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className={styles.btnPagina}
          aria-label="Página anterior"
        >
          &#8592;
        </Button>
        <Typography className={styles.paginaAtual} variant="body1">
          {pagina} de {totalPaginas}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas}
          className={styles.btnPagina}
          aria-label="Próxima página"
        >
          &#8594;
        </Button>
      </Stack>
    </Box>
  );
}

export default ListaAgendamentos;