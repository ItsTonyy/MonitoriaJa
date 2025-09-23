import React, { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";
import styles from "./ListaMonitores.module.css";

type Monitor = {
  id: number;
  nome: string;
  materia: string;
  valor: string;
  servico: string;
  foto: string;
  avaliacao: number;
};

const MONITORES: Monitor[] = [
  { id: 1, nome: "João Silva", materia: "Matemática", valor: "R$ 50/h", servico: "Serviço X", foto: "https://randomuser.me/api/portraits/men/1.jpg", avaliacao: 4.9 },
  { id: 2, nome: "Maria Souza", materia: "Física", valor: "R$ 60/h", servico: "Serviço X", foto: "https://randomuser.me/api/portraits/women/2.jpg", avaliacao: 4.8 },
  { id: 3, nome: "Carlos Lima", materia: "Química", valor: "R$ 55/h", servico: "Serviço X", foto: "https://randomuser.me/api/portraits/men/3.jpg", avaliacao: 4.5 },
  { id: 4, nome: "Ana Paula", materia: "Biologia", valor: "R$ 58/h", servico: "Serviço X", foto: "https://randomuser.me/api/portraits/women/4.jpg", avaliacao: 4.7 },
];

const MATERIAS = [
  "Matemática","Física","Química","Biologia","História","Geografia","Português","Inglês","Programação",
];

function matchStartOfWords(text: string, search: string) {
  if (!search) return true;
  const s = search.trim().toLowerCase();
  return text.toLowerCase().split(/\s+/).some((w) => w.startsWith(s));
}

function getGridCols() {
  if (typeof window === "undefined") return 2;
  return window.innerWidth >= 831 ? 2 : 1;
}

function getGridRows() {
  const alturaReservada = 350;
  const alturaCard = 200;
  const alturaDisponivel =
    typeof window !== "undefined" ? window.innerHeight - alturaReservada : 600;
  return Math.max(1, Math.floor(alturaDisponivel / alturaCard));
}

function getCardsPerPage() {
  const cols = getGridCols();
  const rows = getGridRows();
  if (cols === 1) {
    return rows; 
  } else {
    return rows * 2; 
  }
}

function ListaMonitores() {
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaMateria, setBuscaMateria] = useState("");
  const [pagina, setPagina] = useState(1);
  const [cols, setCols] = useState(getGridCols());
  const [cardsPorPagina, setCardsPorPagina] = useState(getCardsPerPage());
  const title = "Lista de Monitores";
  const nenhumMonitorMsg = "Nenhum monitor encontrado.";

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
      (m) => matchStartOfWords(m.nome, buscaNome) && matchStartOfWords(m.materia, buscaMateria)
    );
  }, [buscaNome, buscaMateria]);

  const totalPaginas = Math.max(1, Math.ceil(monitoresFiltrados.length / cardsPorPagina));
  useEffect(() => {
    if (pagina > totalPaginas) setPagina(1);
  }, [totalPaginas, pagina]);

  const monitoresPagina = monitoresFiltrados.slice(
    (pagina - 1) * cardsPorPagina,
    pagina * cardsPorPagina
  );

  return (
    <Box className={styles.container} sx={{ py: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {title}
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" alignItems="center" className={styles.buscaFiltro} sx={{ mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Buscar por nome"
          value={buscaNome}
          onChange={(e) => { setBuscaNome(e.target.value); setPagina(1); }}
          onKeyDown={(e) => e.key === "Enter" && setPagina(1)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="Buscar" onClick={() => setPagina(1)} edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 220, maxWidth: 350 }}
        />

        <Autocomplete
          freeSolo
          options={MATERIAS}
          value={buscaMateria}
          onInputChange={(_, value) => { setBuscaMateria(value); setPagina(1); }}
          filterOptions={(options, { inputValue }) => options.filter((o) => matchStartOfWords(o, inputValue))}
          renderInput={(params) => <TextField {...params} label="Filtrar por disciplina" variant="outlined" sx={{ minWidth: 220, maxWidth: 350 }} />}
          ListboxProps={{ style: { maxHeight: 190, overflowY: "auto" } }}
        />
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2, minHeight: 32 }}>
        {buscaMateria && <Chip label={`Matéria: ${buscaMateria}`} onDelete={() => setBuscaMateria("")} color="primary" variant="outlined" />}
        {buscaNome && <Chip label={`Nome: ${buscaNome}`} onDelete={() => setBuscaNome("")} color="secondary" variant="outlined" />}
      </Stack>

      {}
      <Grid container spacing={4} justifyContent="center" className={styles.rowMonitores}>
        {monitoresPagina.length === 0 ? (
          <Grid item xs={12}
          component={"div" as unknown as React.ElementType}>
            <Typography align="center" color="text.secondary">{nenhumMonitorMsg}</Typography>
          </Grid>
        ) : (
          monitoresPagina.map((monitor) => (
            <Grid item xs={12} sm={cols === 2 ? 6 : 12} component={"div" as unknown as React.ElementType} key={monitor.id} style={{ display: "flex" }}>
              <div className={styles.monitorCard}>
                <div className={styles.monitorImgAvaliacao}>
                  <CardMedia component="img" image={monitor.foto} alt={`Foto de ${monitor.nome}`} className={styles.monitorFoto} />
                  <div className={styles.monitorAvaliacao}>
                    <StarIcon sx={{ color: "#f5b301", verticalAlign: "middle" }} />
                    <Typography variant="body2" component="span" sx={{ fontWeight: 500, ml: 0.5 }}>{monitor.avaliacao}</Typography>
                  </div>
                </div>

                <CardContent className={styles.monitorInfo}>
                  <Typography variant="h6" className={styles.monitorNome} color="primary">{monitor.nome}</Typography>
                  <Typography variant="body1" className={styles.monitorMateria}>{monitor.materia}</Typography>
                  <Typography variant="body2" className={styles.monitorValor}>{monitor.valor}</Typography>
                  <Typography variant="body2" className={styles.monitorServico}>{monitor.servico}</Typography>
                </CardContent>

                <Box className={styles.btnAcessarBox}>
                  <Button variant="contained" color="primary" className={styles.btnAcessar} href="/detalhesMonitor">Acessar</Button>
                </Box>
              </div>
            </Grid>
          ))
        )}
      </Grid>

      {}
      <Stack direction="row" justifyContent="center" spacing={2} sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={() => setPagina((p) => Math.max(1, p - 1))} disabled={pagina === 1} aria-label="Página anterior">&#8592;</Button>
        <Box sx={{ display: "flex", alignItems: "center", px: 1 }}>
          <Typography variant="body1"> {pagina} de {totalPaginas}</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} aria-label="Próxima página">&#8594;</Button>
      </Stack>
    </Box>
  );
}

export default ListaMonitores;