import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
} from "@mui/material";

interface ModalRemarcarProps {
  open: boolean;
  onClose: () => void;
  agendamento: {
    foto: string;
    nome: string;
    materia: string;
    data: string;
    hora: string;
  };
  onRemarcar: (novaData: string, novoHorario: string) => void;
}

function formatHora(hora: string) {
  // Aceita "14h", "14:00", "9h", "09h", etc.
  if (hora.includes(":")) return hora;
  const h = hora.replace("h", "");
  return h.padStart(2, "0") + ":00";
}

const ModalRemarcar: React.FC<ModalRemarcarProps> = ({
  open,
  onClose,
  agendamento,
  onRemarcar,
}) => {
  const [novaData, setNovaData] = useState("");
  const [novoHorario, setNovoHorario] = useState("");

  // Validação: nova data/hora deve ser pelo menos 2 dias após agora
  const isValidDateTime = () => {
    if (!novaData || !novoHorario) return false;
    // Data/hora atuais do agendamento
    const atual = new Date(
      `${agendamento.data.split("/").reverse().join("-")}T${formatHora(
        agendamento.hora
      )}`
    );
    // Nova data/hora escolhida
    const selecionada = new Date(`${novaData}T${novoHorario}`);
    return selecionada > atual;
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-remarcar-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 480,
          minHeight: 380,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={agendamento.foto}
            alt={agendamento.nome}
            sx={{
              width: 80,
              height: 80,
              border: 2,
              borderColor: "primary.main",
            }}
          />

          <Typography variant="h6" color="primary.main" align="center">
            {agendamento.nome}
          </Typography>
          <Box sx={{ width: "100%" }}>
            <Typography variant="body1" color="text.secundary" align="center">
              Disciplina: {agendamento.materia}
            </Typography>
          </Box>

          <Typography
            variant="subtitle1"
            color="text.secundary"
            fontWeight="bold"
          >
            Data atual: {agendamento.data}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secundary"
            fontWeight="bold"
          >
            Horário atual: {agendamento.hora}
          </Typography>
          <TextField
            label="Nova Data"
            type="date"
            value={novaData}
            onChange={(e) => setNovaData(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField
            label="Novo Horário"
            type="time"
            value={novoHorario}
            onChange={(e) => setNovoHorario(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          {!isValidDateTime() && novaData && novoHorario && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              Atenção: A nova data e horário tem que ser posterior à data e
              horário atuais do agendamento.
            </Typography>
          )}
        </Stack>
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button
            variant="contained"
            sx={{
              bgcolor: "#6b7280 !important",
              "&:hover": { bgcolor: "#374151 !important" },
              minWidth: 120,
              px: 3,
            }}
            onClick={onClose}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#2d5be3 !important",
              "&:hover": { bgcolor: "#1b3e8a !important" },
              minWidth: 120,
              px: 3,
              "&.Mui-disabled": {
                bgcolor: "#b3c6f7 !important",
                color: "#ffffff99",
                opacity: 0.6,
              },
            }}
            onClick={() => onRemarcar(novaData, novoHorario)}
            disabled={!isValidDateTime()}
          >
            Solicitar Reagendamento
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalRemarcar;
