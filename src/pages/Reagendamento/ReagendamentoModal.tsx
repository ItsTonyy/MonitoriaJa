import React, { useState } from 'react';
import { Box, Typography, Button, Modal, IconButton, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';

import styles from './AgendamentoModal.module.css';

interface AgendamentoModalProps {
  open: boolean;
  handleClose: () => void;
}

const ReagendamentoModal: React.FC<AgendamentoModalProps> = ({ open, handleClose }) => {
  const [showCounterProposal, setShowCounterProposal] = useState(false);

  const handleOpenCounterProposal = () => setShowCounterProposal(true);
  const handleSendCounterProposal = () => {
    console.log('Contraproposta enviada!');
    handleClose();
  };
  const handleCancel = () => handleClose();
  const handleAccept = () => handleClose();

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className={styles.modalBox}>

        {/* Cabeçalho */}
        <Box className={styles.modalHeader}>
          <Typography variant="h6" component="h2">
            {showCounterProposal ? 'Enviar Contra Proposta' : 'Confira seu reagendamento'}
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Conteúdo do modal */}
        <Box className={styles.modalContent}>
          {!showCounterProposal ? (
            <>
              {/* Info do monitor */}
              <Box className={styles.monitorInfo}>
                <PersonIcon className={styles.monitorIcon} />
                <Box>
                  <Typography className={styles.monitorName}>Monitor X</Typography>
                  <Typography className={styles.monitorSubject}>Matéria X</Typography>
                </Box>
              </Box>

              {/* Datas */}
              <Box className={styles.dateSection}>
                <Typography className={styles.sectionTitle}>Data anterior</Typography>
                <Box className={styles.dateRow}>
                  <CalendarTodayIcon className={styles.dateIcon} />
                  <Typography className={styles.dateText}>xx/xx/xxxx</Typography>
                  <AccessTimeIcon className={styles.dateIcon} />
                  <Typography className={styles.dateText}>xx:xx</Typography>
                </Box>

                <Typography className={styles.sectionTitle}>Proposta de reagendamento</Typography>
                <Box className={styles.dateRow}>
                  <CalendarTodayIcon className={styles.dateIcon} />
                  <Typography className={styles.dateText}>xx/xx/xxxx</Typography>
                  <AccessTimeIcon className={styles.dateIcon} />
                  <Typography className={styles.dateText}>xx:xx</Typography>
                </Box>
              </Box>

              {/* Botões */}
              <Box className={styles.buttonGroup}>
                <Button
                  className={styles.reusableButtonSecondary}
                  fullWidth
                  onClick={handleCancel}
                >
                  Recusar
                </Button>

                <Button
                  className={styles.reusableButtonPrimary}
                  fullWidth
                  onClick={handleAccept}
                >
                  Aceitar
                </Button>

                <Button
                  className={styles.reusableButtonPrimary}
                  fullWidth
                  onClick={handleOpenCounterProposal}
                >
                  Contra Proposta
                </Button>
              </Box>
            </>
          ) : (
            <>
              {/* Contra proposta */}
              <Typography className={styles.sectionText}>
                Preencha o formulário abaixo para enviar uma contraproposta de agendamento.
              </Typography>

              <Box className={styles.fieldsContainer}>
                <TextField
                  fullWidth
                  label="Nova Data"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  label="Nova Hora"
                  type="time"
                  InputLabelProps={{ shrink: true }}
                />
              </Box>

              <Box className={styles.actionButtons}>
                <Button
                  className={styles.reusableButtonSecondary}
                  onClick={() => setShowCounterProposal(false)}
                >
                  Voltar
                </Button>

                <Button
                  className={styles.reusableButtonPrimary}
                  onClick={handleSendCounterProposal}
                >
                  Enviar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ReagendamentoModal;
