import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Paper,
  Stack,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DisciplinaModal from "./disciplina/DisciplinaModal";
import {
  listarDisciplinas,
  criarDisciplina,
  atualizarDisciplina,
  removerDisciplina,
  listarMonitoresPorDisciplina,
} from "../redux/features/disciplina/fetch";
import { Disciplina } from "../models/disciplina.model";

const ListaDisciplinas: React.FC = () => {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDisciplina, setEditDisciplina] = useState<Disciplina | null>(null);

  // Paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Carrega disciplinas do backend
  const fetchDisciplinas = async () => {
    try {
      const data = await listarDisciplinas();
      setDisciplinas(data);
    } catch {
      setDisciplinas([]);
    }
  };

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  // Adiciona disciplina
  const handleAddDisciplina = async (nome: string) => {
    try {
      await criarDisciplina({ nome });
      fetchDisciplinas();
    } catch {}
  };

  // Edita disciplina
  const handleEditDisciplina = async (nome: string) => {
    if (!editDisciplina) return;
    try {
      await atualizarDisciplina(editDisciplina._id!, { nome });
      setEditDisciplina(null);
      fetchDisciplinas();
    } catch {}
  };

  // Exclui disciplina
  const handleDeleteDisciplina = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta disciplina?")) return;
    try {
      // Verifica se há monitores alocados
      const monitores = await listarMonitoresPorDisciplina(id);
      if (monitores && monitores.length > 0) {
        alert("Não é possível remover esta disciplina pois existem monitores alocados nela.");
        return;
      }
      await removerDisciplina(id);
      fetchDisciplinas();
    } catch {}
  };

  // Paginação handlers
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Disciplinas da página atual
  const disciplinasPaginadas = disciplinas.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box
      sx={{
        maxWidth: 1400,      // aumente aqui
        minWidth: 900,       // aumente aqui
        margin: "40px auto",
        padding: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "0 8px 24px rgba(5, 3, 21, 0.08)"
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h5">Disciplinas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Nova Disciplina
        </Button>
      </Stack>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome da Disciplina</TableCell>
              <TableCell align="center">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {disciplinasPaginadas.map((disciplina) => (
              <TableRow key={disciplina._id}>
                <TableCell>{disciplina.nome}</TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setEditDisciplina(disciplina);
                      setModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteDisciplina(disciplina._id!)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {disciplinasPaginadas.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Nenhuma disciplina cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={disciplinas.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
          labelRowsPerPage="Linhas por página:"
        />
      </TableContainer>

      {/* Modal para adicionar/editar disciplina */}
      <DisciplinaModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditDisciplina(null);
        }}
        onSave={(nome) => {
          if (editDisciplina) {
            handleEditDisciplina(nome);
          } else {
            handleAddDisciplina(nome);
          }
        }}
        disciplina={editDisciplina ?? undefined}
      />
    </Box>
  );
};

export default ListaDisciplinas;