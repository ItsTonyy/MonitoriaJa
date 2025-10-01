import React from 'react';
import { Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmationButton from '../../../../components/login-form/ConfirmationButton';
import styles from './ConfirmaPagamentoPage.module.css';
import CartaoTemporario from '../cartaotemporario.webp';

const PixPage: React.FC = () => {
  const orderId = '#0000';
  const orderValue = 'R$ 00,00';
  const cardNumber = '0000000000';
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/agendamento-monitor');
  };

  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <div className={styles.name} 
            contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Nome do aluno"
              tabIndex={0}
        >
          Cartão
        </div>

        <div className={styles.infoText}>
          Pedido {orderId}
        </div>
        <div className={styles.infoText}>
          Valor de compra: {orderValue}
        </div>

        <img src={CartaoTemporario} alt="Cartão" />
        <div className={styles.infoText}>
          Número do cartao: 000000000{cardNumber}
        </div>

        <Box className={styles.buttonGroup}>
          <ConfirmationButton 
            className={styles.reusableButton} 
          >
            Confirmar Compra
          </ConfirmationButton>

          <ConfirmationButton 
            className={styles.reusableButton} 
            onClick={handleCancel}
          >
            Cancelar
          </ConfirmationButton>
        </Box>
      </Box>
    </main>
  );
};

export default PixPage;
