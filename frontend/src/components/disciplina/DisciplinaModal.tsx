import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import React from "react";

interface DisciplinaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (nomeDisciplina: string) => void;
}

const DisciplinaModal = ({ open, onClose, onSave }: DisciplinaModalProps) => {
  const [nomeDisciplina, setNomeDisciplina] = React.useState("");
  const [error, setError] = React.useState(false);

  const handleSave = () => {
    if (!nomeDisciplina.trim()) {
      setError(true);
      return;
    }
    onSave(nomeDisciplina);
    setNomeDisciplina("");
    setError(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-disciplina"
      aria-describedby="modal-cadastro-disciplina"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography
          id="modal-disciplina"
          variant="h6"
          component="h2"
          sx={{ mb: 3 }}
        >
          Cadastrar Nova Disciplina
        </Typography>

        <TextField
          fullWidth
          label="Nome da Disciplina"
          variant="outlined"
          value={nomeDisciplina}
          onChange={(e) => {
            setNomeDisciplina(e.target.value);
            setError(false);
          }}
          error={error}
          helperText={error ? "O nome da disciplina é obrigatório" : ""}
          sx={{ mb: 3 }}
        />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!nomeDisciplina.trim()}
          >
            Salvar
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DisciplinaModal;
