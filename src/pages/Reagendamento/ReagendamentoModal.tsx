import React, { useState } from 'react';
import { Box, Typography, Modal, IconButton, TextField } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ConfirmationButton from '../../components/login-form/ConfirmationButton';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ReagendamentoModal.module.css';

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

              <div className={styles.photoContainer}>
                          <PersonIcon className={styles.profilePhotoIcon} />
                        </div>
                
                
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
                <ConfirmationButton
                  className={styles.reusableButtonSecondary}
                  fullWidth
                  onClick={handleCancel}
                >
                  Recusar
                </ConfirmationButton>

                <ConfirmationButton
                  className={styles.reusableButtonPrimary}
                  fullWidth
                  onClick={handleAccept}
                >
                  Aceitar
                </ConfirmationButton>

                <ConfirmationButton
                  className={styles.reusableButtonPrimary}
                  fullWidth
                  onClick={handleOpenCounterProposal}
                >
                  Contra Proposta
                </ConfirmationButton>
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
                <ConfirmationButton
                  className={styles.reusableButtonSecondary}
                  onClick={() => setShowCounterProposal(false)}
                >
                  Voltar
                </ConfirmationButton>

                <ConfirmationButton
                  className={styles.reusableButtonPrimary}
                  onClick={handleSendCounterProposal}
                >
                  Enviar
                </ConfirmationButton>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default ReagendamentoModal;
