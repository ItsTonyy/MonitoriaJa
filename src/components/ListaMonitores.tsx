import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  TextField,
  Autocomplete,
  InputAdornment,
  Chip,
  Stack,
  Grid,
  Paper,
  Box,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { setSelectedMonitor } from "../redux/features/monitor/monitorSlice";

export type Monitor = {
  id: number;
  nome: string;
  materia: string;
  valor: string;
  servico: string;
  foto: string;
  avaliacao: number;
  formacao?: string;
};

export const MONITORES: Monitor[] = [
  {
    id: 1,
    nome: "João Silva",
    materia: "Matemática",
    valor: "R$ 50/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    avaliacao: 4.9,
    formacao:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
  },
  {
    id: 2,
    nome: "Maria Souza",
    materia: "Física",
    valor: "R$ 60/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    avaliacao: 4.8,
  },
  {
    id: 3,
    nome: "Carlos Lima",
    materia: "Química",
    valor: "R$ 55/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    avaliacao: 4.5,
  },
  {
    id: 4,
    nome: "Ana Paula",
    materia: "Biologia",
    valor: "R$ 58/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/4.jpg",
    avaliacao: 4.7,
  },
  {
    id: 5,
    nome: "João Silva",
    materia: "Matemática",
    valor: "R$ 50/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    avaliacao: 4.9,
  },
  {
    id: 6,
    nome: "Maria Souza",
    materia: "Física",
    valor: "R$ 60/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    avaliacao: 4.8,
  },
  {
    id: 7,
    nome: "Carlos Lima",
    materia: "Química",
    valor: "R$ 55/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    avaliacao: 4.5,
  },
  {
    id: 8,
    nome: "Ana Paula",
    materia: "Biologia",
    valor: "R$ 58/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/4.jpg",
    avaliacao: 4.7,
  },
  {
    id: 9,
    nome: "Ana Paula",
    materia: "Biologia",
    valor: "R$ 58/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/4.jpg",
    avaliacao: 4.7,
  },
  {
    id: 10,
    nome: "João Silva",
    materia: "Matemática",
    valor: "R$ 50/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/1.jpg",
    avaliacao: 4.9,
  },
  {
    id: 11,
    nome: "Maria Souza",
    materia: "Física",
    valor: "R$ 60/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/women/2.jpg",
    avaliacao: 4.8,
  },
  {
    id: 12,
    nome: "Carlos Lima",
    materia: "Química",
    valor: "R$ 55/h",
    servico: "Serviço X",
    foto: "https://randomuser.me/api/portraits/men/3.jpg",
    avaliacao: 4.5,
  },
];

const MATERIAS = [
  "Matemática",
  "Física",
  "Química",
  "Biologia",
  "História",
  "Geografia",
  "Português",
  "Inglês",
  "Programação",
];

function matchStartOfWords(text: string, search: string) {
  if (!search) return true;
  const s = search.trim().toLowerCase();
  return text
    .toLowerCase()
    .split(/\s+/)
    .some((w) => w.startsWith(s));
}

function getGridCols() {
  if (typeof window === "undefined") return 2;
  const width = window.innerWidth;
  if (width >= 1200) return 3;
  if (width >= 771) return 2;
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

function getCardsPerPage() {
  const cols = getGridCols();
  const rows = getGridRows();
  return cols * rows;
}

function ListaMonitores() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaMateria, setBuscaMateria] = useState("");
  const [pagina, setPagina] = useState(1);
  const [, setCols] = useState(getGridCols());
  const [cardsPorPagina, setCardsPorPagina] = useState(getCardsPerPage());

  useEffect(() => {
    function handleResize() {
      const newCols = getGridCols();
      setCols(newCols);
      setCardsPorPagina(getCardsPerPage());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const monitoresFiltrados = useMemo(() => {
    return MONITORES.filter(
      (m) =>
        matchStartOfWords(m.nome, buscaNome) &&
        matchStartOfWords(m.materia, buscaMateria)
    );
  }, [buscaNome, buscaMateria]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(monitoresFiltrados.length / cardsPorPagina)
  );
  useEffect(() => {
    if (pagina > totalPaginas) setPagina(1);
  }, [totalPaginas, pagina]);

  const monitoresPagina = monitoresFiltrados.slice(
    (pagina - 1) * cardsPorPagina,
    pagina * cardsPorPagina
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
        Lista de Monitores
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{
          mb: 3,
          width: "100%",
          display: "flex",
          "& > *": {
            width: { xs: "100%", sm: "auto" },
          },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar monitor por nome..."
          value={buscaNome}
          onChange={(e) => {
            setBuscaNome(e.target.value);
            setPagina(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 350 }}
        />

        <Autocomplete
          fullWidth
          freeSolo
          options={MATERIAS}
          value={buscaMateria}
          onInputChange={(_, value) => {
            setBuscaMateria(value);
            setPagina(1);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrar por disciplina"
              variant="outlined"
            />
          )}
          sx={{ maxWidth: 350 }}
          ListboxProps={{ style: { maxHeight: 200 } }}
        />
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
        {buscaMateria && (
          <Chip
            label={`Matéria: ${buscaMateria}`}
            onDelete={() => setBuscaMateria("")}
            color="primary"
          />
        )}
        {buscaNome && (
          <Chip
            label={`Nome: ${buscaNome}`}
            onDelete={() => setBuscaNome("")}
            color="secondary"
          />
        )}
      </Stack>

      <Grid
        container
        spacing={3}
        justifyContent="center"
        sx={{
          width: "100%",
          margin: "0 auto",
        }}
      >
        {monitoresPagina.length === 0 ? (
          <Grid
            item
            xs={12}
            component={"div" as unknown as React.ElementType}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Typography align="center" color="text.secondary" sx={{ my: 4 }}>
              Nenhum monitor encontrado.
            </Typography>
          </Grid>
        ) : (
          monitoresPagina.map((monitor) => (
            <Grid
              item
              xs={12} // Sempre ocupará 100% da largura
              component={"div" as unknown as React.ElementType}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
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
                      image={monitor.foto}
                      alt={`Foto de ${monitor.nome}`}
                      sx={{
                        width: { xs: 70, sm: 80 },
                        height: { xs: 70, sm: 80 },
                        borderRadius: "50%",
                        border: 2,
                        borderColor: "primary.main",
                      }}
                    />
                    <div>
                      <StarIcon
                        sx={{ color: "#f5b301", verticalAlign: "middle" }}
                      />
                      <Typography
                        variant="body2"
                        component="span"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.9rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {monitor.avaliacao}
                      </Typography>
                    </div>
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
                   > */}
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
                      {monitor.nome}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {monitor.materia}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {monitor.valor}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {monitor.servico}
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
                      spacing={1}
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
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => {
                          dispatch(setSelectedMonitor(monitor));
                          navigate("/MonitoriaJa/detalhes-monitor");
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

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
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

export default ListaMonitores;