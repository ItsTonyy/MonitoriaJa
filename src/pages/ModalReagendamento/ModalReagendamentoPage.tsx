import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

import styles from "./ModalReagendamentoPage.module.css";

const AgendamentoPage: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <main className={styles.centralizeContent}>
      {/* Botão que abre o modal */}
      <Button
        variant="contained"
        className={styles.actionButton}
        onClick={handleOpen}
      >
        Pedido de Reagendamento
      </Button>

      {/* Modal principal */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        classes={{ paper: styles.dialogPaper }}
      >
        {/* Cabeçalho */}
        <DialogTitle className={styles.dialogTitle}>
          Confira seu reagendamento
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Conteúdo */}
        <DialogContent className={styles.dialogContent}>
          {/* Informações do monitor */}
          <div className={styles.monitorInfo}>
            <div className={styles.photoContainer}>
              <PersonIcon className={styles.profilePhotoIcon} />
            </div>
            <div>
              <Typography className={styles.boldText}><b>Monitor X</b></Typography>
              <Typography className={styles.infoSubText}>Matéria X</Typography>
            </div>
          </div>

          {/* Data anterior */}
          <Typography className={styles.boldText}><b>Data anterior</b></Typography>
          <div className={styles.dateRow}>
            <EventIcon className={styles.iconAgendamento} />
            <Typography className={styles.infoSubText}>xx/xx/xxxx</Typography>
            <AccessTimeIcon className={styles.iconAgendamento} />
            <Typography className={styles.infoSubText}>xx:xx</Typography>
          </div>

          {/* Proposta de reagendamento */}
          <Typography className={styles.boldText}><b>Proposta de reagendamento</b></Typography>
          <div className={styles.dateRow}>
            <EventIcon className={styles.iconAgendamento} />
            <Typography className={styles.infoSubText}>xx/xx/xxxx</Typography>
            <AccessTimeIcon className={styles.iconAgendamento} />
            <Typography className={styles.infoSubText}>xx:xx</Typography>
          </div>
        </DialogContent>

        {/* Ações */}
        <DialogActions className={styles.dialogActionsColumn}>
  <div className={styles.buttonRow}>
    <Button
      className={styles.actionButton}
    >
      Recusar
    </Button>
    <Button
      className={styles.actionButton}
    >
      Aceitar
    </Button>
  </div>
  <Button
    className={styles.actionButton}
  >
    Contra Proposta
  </Button>
</DialogActions>
      </Dialog>
    </main>
  );
};

export default AgendamentoPage;