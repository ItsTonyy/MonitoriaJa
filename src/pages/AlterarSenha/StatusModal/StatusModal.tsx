import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import styles from "./StatusModal.module.css";
import ConfirmationButton from '../../../components/login-form/ConfirmationButton';

interface StatusModalProps {
  open: boolean;
  onClose: () => void;
  status: "sucesso" | "falha";
  mensagem: string;
}

const StatusModal: React.FC<StatusModalProps> = ({
  open,
  onClose,
  status,
  mensagem,
}) => {
  return (
    <Dialog open={open} onClose={onClose} className={styles.modal}>
      <DialogContent className={styles.content}>
        <Typography
          variant="h6"
          className={status === "sucesso" ? styles.successText : styles.errorText}
        >
          {status === "sucesso" ? "Sucesso" : "Falha"}
        </Typography>

        <Typography variant="body1" className={styles.messageText}>
          {mensagem}
        </Typography>
      </DialogContent>
      <DialogActions className={styles.actions}>
        <ConfirmationButton 
          onClick={onClose} 
          className={styles.closeButton}
        >
          Fechar
        </ConfirmationButton>
      </DialogActions>
    </Dialog>

  );
};

export default StatusModal;