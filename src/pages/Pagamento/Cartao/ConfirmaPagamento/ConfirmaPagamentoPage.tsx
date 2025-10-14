import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import styles from './ConfirmaPagamentoPage.module.css';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import StatusModal from '../../../AlterarSenha/StatusModal/StatusModal';
import CartaoItem from '../CartaoItem/CartaoItem'; // 🔹 ajuste o caminho conforme sua estrutura

const ConfirmaPagamento: React.FC = () => {
  const orderId = '#0000';
  const orderValue = 'R$ 00,00';
  const cardNumber = '0000005678';
  const navigate = useNavigate();
  const location = useLocation();
  const cartao = location.state?.cartao;
  const [open, setOpen] = useState(false);

const handleCancel = () => {
  navigate(-1);
};


  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Cartão" />

        <div className={styles.infoText}>Pedido {orderId}</div>
        <div className={styles.infoText}>Valor de compra: {orderValue}</div>

        {/* 🔹 Substitui a imagem antiga pelo componente de cartão */}
        <CartaoItem
          numero={cartao?.numero ?? '************0000'}
          nome={cartao?.nome ?? 'Nome não disponível'}
          bandeira={cartao?.bandeira ?? 'Visa'}
          mostrarBotoes={false}
        />


        <Box className={styles.buttonGroup}>
          <ConfirmationButton
            onClick={() => setOpen(true)}
          >
            Confirmar Pagamento
          </ConfirmationButton>

          <ConfirmationButton 
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

export default ConfirmaPagamento;
