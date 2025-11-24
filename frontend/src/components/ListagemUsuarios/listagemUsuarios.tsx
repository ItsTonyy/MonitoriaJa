import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  CardContent,
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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import StarIcon from "@mui/icons-material/Star";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchUsuariosAdmin } from "../../redux/features/admin/fetch";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: string;
  name: string;
  email: string;
  telefone: string;
  role: 'admin' | 'monitor' | 'user';
  foto?: string;
  materia?: string;
  valor?: string;
  avaliacao?: number;
}

const roleLabels = {
  admin: 'Administrador',
  monitor: 'Monitor',
  user: 'Aluno'
};

const roleIcons = {
  admin: <AdminPanelSettingsIcon />,
  monitor: <SchoolIcon />,
  user: <PersonIcon />
};

function matchStartOfWords(text: string, search: string) {
  if (!search) return true;
  if (!text) return false;
  
  const searchTerms = search.trim().toLowerCase().split(/\s+/);
  const textWords = text.toLowerCase().split(/\s+/);
  
  return searchTerms.every(searchTerm => 
    textWords.some(word => word.startsWith(searchTerm))
  );
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

function ListagemUsuarios() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { usuarios, loading } = useAppSelector((state) => state.admin);
  const [buscaNome, setBuscaNome] = useState("");
  const [buscaRole, setBuscaRole] = useState<string>("");
  const [pagina, setPagina] = useState(1);
  const [cardsPorPagina, setCardsPorPagina] = useState(getCardsPerPage());
  const [dialogAberto, setDialogAberto] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<UserData | null>(null);
  const [removendo, setRemovendo] = useState(false);

  useEffect(() => {
    dispatch(fetchUsuariosAdmin());
  }, [dispatch]);

  useEffect(() => {
    function handleResize() {
      setCardsPorPagina(getCardsPerPage());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(
      (u) =>
        matchStartOfWords(u.name, buscaNome) &&
        (buscaRole === "" || u.role === buscaRole)
    );
  }, [usuarios, buscaNome, buscaRole]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(usuariosFiltrados.length / cardsPorPagina)
  );
  
  useEffect(() => {
    if (pagina > totalPaginas) setPagina(1);
  }, [totalPaginas, pagina]);

  const usuariosPagina = usuariosFiltrados.slice(
    (pagina - 1) * cardsPorPagina,
    pagina * cardsPorPagina
  );

  const handleVisualizarUsuario = (usuario: UserData) => {
    if (usuario.role === 'monitor' || usuario.role === 'admin') {
      navigate(`/MonitoriaJa/perfil-monitor/${usuario.id}`);
    } else {
      navigate(`/MonitoriaJa/perfil-usuario/${usuario.id}`);
    }
  };

  const handleAbrirDialogRemocao = (usuario: UserData) => {
    setUsuarioSelecionado(usuario);
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setUsuarioSelecionado(null);
    setRemovendo(false);
  };

  const handleConfirmarRemocao = async () => {
    if (!usuarioSelecionado) return;

    setRemovendo(true);
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Token de autenticação não encontrado. Faça login novamente.");
        setRemovendo(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/usuario/${usuarioSelecionado.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      
      dispatch(fetchUsuariosAdmin());
      
      handleFecharDialog();
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
      alert("Erro ao remover usuário. Tente novamente.");
      setRemovendo(false);
    }
  };

  if (loading) {
    return (
      <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Carregando...</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: "background.default",
        maxWidth: 1200,
        boxShadow: "0 8px 24px rgba(5, 3, 21, 0.08)",
        width: "100%"
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
        Gerenciamento de Usuários
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
          placeholder="Buscar usuário por nome..."
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
          options={['admin', 'monitor', 'user']}
          getOptionLabel={(option) => roleLabels[option as keyof typeof roleLabels]}
          value={buscaRole || null}
          onChange={(_, value) => {
            setBuscaRole(value || "");
            setPagina(1);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrar por tipo"
              variant="outlined"
            />
          )}
          sx={{ maxWidth: 350 }}
        />
      </Stack>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
        {buscaRole && (
          <Chip
            label={`Tipo: ${roleLabels[buscaRole as keyof typeof roleLabels]}`}
            onDelete={() => setBuscaRole("")}
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
        {usuariosPagina.length === 0 ? (
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
              Nenhum usuário encontrado.
            </Typography>
          </Grid>
        ) : (
          usuariosPagina.map((usuario) => (
            <Grid
              key={usuario.id}
              item
              xs={12}
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
                    {usuario.foto ? (
                      <Avatar
                        src={usuario.foto}
                        sx={{
                          width: { xs: 70, sm: 80 },
                          height: { xs: 70, sm: 80 },
                          border: 2,
                          borderColor: "primary.main",
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: { xs: 70, sm: 80 },
                          height: { xs: 70, sm: 80 },
                          bgcolor: usuario.role === 'admin' ? 'error.main' : usuario.role === 'monitor' ? 'success.main' : 'primary.main',
                          border: 2,
                          borderColor: "primary.main",
                        }}
                      >
                        {roleIcons[usuario.role]}
                      </Avatar>
                    )}
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 1, fontWeight: 'bold' }}
                    >
                      {roleLabels[usuario.role]}
                    </Typography>
                    {usuario.role === 'monitor' && usuario.avaliacao && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <StarIcon sx={{ color: "#f5b301", fontSize: 16 }} />
                        <Typography variant="caption" color="text.secondary">
                          {usuario.avaliacao}
                        </Typography>
                      </Box>
                    )}
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
                      {usuario.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {usuario.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {usuario.telefone || 'Sem telefone'}
                    </Typography>
                    {usuario.role === 'monitor' && usuario.materia && (
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontWeight: 'bold',
                        }}
                      >
                        {usuario.materia}
                      </Typography>
                    )}
                    {usuario.role === 'monitor' && usuario.valor && (
                      <Typography
                        variant="body2"
                        color="success.main"
                        sx={{
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {usuario.valor}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontSize: "0.75rem",
                        mt: 0.5,
                      }}
                    >
                      ID: {usuario.id}
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
                          padding: "8px 16px",
                          fontSize: "0.875rem",
                        },
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        size="medium"
                        onClick={() => handleVisualizarUsuario(usuario)}
                      >
                        Visualizar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleAbrirDialogRemocao(usuario)}
                        disabled={removendo}
                      >
                        Remover
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

      <Dialog
        open={dialogAberto}
        onClose={handleFecharDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja remover o usuário <strong>{usuarioSelecionado?.name}</strong>? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog} disabled={removendo}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmarRemocao}
            color="error"
            variant="contained"
            disabled={removendo}
            startIcon={removendo ? <CircularProgress size={20} /> : undefined}
          >
            {removendo ? "Removendo..." : "Remover"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default ListagemUsuarios;