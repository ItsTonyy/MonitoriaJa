import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ConfirmationButton from '../../../components/login-form/ConfirmationButton';
import styles from './PixPage.module.css';
import Title from '../../AlterarSenha/Titulo/Titulo';
import StatusModal from '../../AlterarSenha/StatusModal/StatusModal';

const PixPage: React.FC = () => {
  const orderId = '#0000';
  const orderValue = 'R$ 00,00';
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleCopyPixCode = () => {
    console.log('Código Pix copiado!');
  };

  const handleCancel = () => {
    navigate('/agendamento-monitor');
  };

  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Pix" />

        <Typography className={styles.infoText}>
          Pedido {orderId}
        </Typography>
        <Typography className={styles.infoText}>
          Valor de compra: {orderValue}
        </Typography>

        <Box className={styles.qrCodeContainer}>
          <QrCode2Icon className={styles.qrCodeIcon} />
        </Box>

        <Box className={styles.buttonGroup}>
           <ConfirmationButton
            className={styles.reusableButton}
            onClick={() => setOpen(true)} 
          >
            Copiar Código Pix
          </ConfirmationButton>
          <ConfirmationButton 
            className={styles.reusableButton} 
            onClick={handleCancel}
          >
            Cancelar
          </ConfirmationButton>
        </Box>
      </Box>

      <StatusModal
        open={open}
        onClose={() => setOpen(false)}
        status="sucesso" 
        mensagem="Pagamento realizado com sucesso!"
      />

    </main>
  );
};

export default PixPage;
