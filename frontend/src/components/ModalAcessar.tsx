import React from "react";
import { Modal, Box, Typography, Avatar, TextField, Button, Stack } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useAppSelector } from "../redux/hooks";

interface ModalAcessarProps {
  open: boolean;
  onClose: () => void;
}

function getUsuarioObj(usuario: string | undefined | null | { [key: string]: any }) {
  return typeof usuario === "object" && usuario !== null ? usuario : undefined;
}

const ModalAcessar: React.FC<ModalAcessarProps> = ({ open, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const agendamento = useAppSelector((state) => state.agendamento.currentAgendamento);
  if (!agendamento) return null;
  const monitorObj = getUsuarioObj(agendamento?.monitor);
  const handleCopy = () => {
    navigator.clipboard.writeText(agendamento.link || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-acessar-title">
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
            src={monitorObj?.foto}
            alt={monitorObj?.nome}
            sx={{
              width: 80,
              height: 80,
              border: 2,
              borderColor: "primary.main",
            }}
          />

          <Typography variant="h6" color="primary.main" align="center">
            {monitorObj?.nome}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Disciplina: {monitorObj?.materia}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Data: {agendamento.data}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Horário: {agendamento.hora}
          </Typography>
          <Box
            sx={{ width: "100%", display: "flex", alignItems: "center", mt: 2 }}
          >
            <TextField
              label="Link da Reunião"
              value={agendamento.link}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
              sx={{ mt: 1 }} // <-- Adicionado margin top
            />
            <Tooltip title={copied ? "Copiado!" : "Copiar link"}>
              <IconButton onClick={handleCopy} sx={{ ml: 1 }}>
                <ContentCopyIcon color={copied ? "success" : "action"} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 2,
              width: "100%",
            }}
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
              }}
              href={agendamento.link!}
              target="_blank"
              rel="noopener noreferrer"
            >
              Entrar na Aula
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ModalAcessar;
