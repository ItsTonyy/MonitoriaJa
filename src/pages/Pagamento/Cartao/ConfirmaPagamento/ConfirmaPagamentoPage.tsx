import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/root-reducer';
import { AppDispatch } from '../../../../redux/store';
import { resetStatus } from '../../../../redux/features/listaCartao/slice';
import { confirmarPagamento } from '../../../../redux/features/listaCartao/actions';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import styles from './ConfirmaPagamentoPage.module.css';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import StatusModal from '../../../AlterarSenha/StatusModal/StatusModal';
import CartaoItem from '../CartaoItem/CartaoItem';

const ConfirmaPagamento: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const cartao = location.state?.cartao;

  const { status, errorMessage } = useSelector((state: RootState) => state.cartoes);

  // 🔹 Controla se o usuário iniciou o pagamento
  const [pagamentoIniciado, setPagamentoIniciado] = useState(false);

  // 🔹 Reseta status antigo ao montar a página
  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  const handleConfirmar = () => {
    setPagamentoIniciado(true);
    dispatch(confirmarPagamento(cartao?.id ?? 1));
  };

  const handleCancel = () => {
    navigate(-1); 
  };

  // 🔹 Função para fechar o modal e redirecionar
  const handleModalClose = () => {
    dispatch(resetStatus());
    setPagamentoIniciado(false);

    if (status === 'success') {
      navigate('/MonitoriaJa/lista-agendamentos');
    }
  };

  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Cartão" />

        <div className={styles.infoText}>Pedido #0000</div>
        <div className={styles.infoText}>Valor de compra: R$ 00,00</div>

        <CartaoItem
          numero={cartao?.numero ?? '************0000'}
          nome={cartao?.nome ?? 'Nome não disponível'}
          bandeira={cartao?.bandeira ?? 'Visa'}
          mostrarBotoes={false}
        />

        <Box className={styles.buttonGroup}>
          <ConfirmationButton onClick={handleConfirmar}>
            Confirmar Pagamento
          </ConfirmationButton>

          <ConfirmationButton onClick={handleCancel}>
            Cancelar
          </ConfirmationButton>
        </Box>
      </Box>

      {/* 🔹 Modal de status apenas após clique */}
      <StatusModal
        open={pagamentoIniciado && (status === 'success' || status === 'error')}
        onClose={handleModalClose}
        status={status === 'success' ? 'sucesso' : 'falha'}
        mensagem={
          status === 'success'
            ? 'Pagamento realizado com sucesso!'
            : errorMessage ?? 'Erro ao processar pagamento.'
        }
      />
    </main>
  );
};

export default ConfirmaPagamento;
