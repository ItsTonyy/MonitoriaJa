import { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { updateAgendamentoStatus } from "../redux/features/agendamento/agendamentoSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks"; // Adicionar useAppSelector


interface ModalCancelamentoProps {
  open: boolean;
  onClose: () => void;
}

function ModalCancelamento({ open, onClose }: ModalCancelamentoProps) {
  const dispatch = useAppDispatch();
  const [motivo, setMotivo] = useState("");
  const agendamento = useAppSelector((state) => state.agendamento.currentAgendamento);

  const handleConfirm = () => {
    dispatch(updateAgendamentoStatus({
      agendamentoId: agendamento!.id!,
      status: 'CANCELADO',
      motivoCancelamento: motivo
    }));
    setMotivo("");
    onClose();
  };

  const handleClose = () => {
    onClose();
    setMotivo("");
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Cancelar agendamento
        </Typography>
        <TextField
          label="Motivo do cancelamento"
          multiline
          minRows={9}
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          variant="outlined"
          fullWidth
        />
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
            onClick={handleClose}
          >
            Voltar
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#e53e3e !important",
              "&:hover": { bgcolor: "#a81d1d !important" },
              minWidth: 120,
              px: 3,
              "&.Mui-disabled": {
                bgcolor: "#f7b3b3 !important",
                color: "#ffffff99",
                opacity: 0.6,
              },
            }}
            onClick={handleConfirm}
            disabled={!motivo.trim()}
          >
            Confirmar cancelamento
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalCancelamento;
