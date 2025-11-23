import React, { useState, useEffect } from 'react';
import { Box, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import styles from './ConfirmaPagamentoPage.module.css';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import CartaoItem from '../CartaoItem/CartaoItem';
import { criarAgendamento } from '../../../../redux/features/agendamento/fetch';
import { addAgendamento } from '../../../../redux/features/agendamento/agendamentoSlice';
import type { RootState } from '../../../../redux/root-reducer';

const ConfirmaPagamentoPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const cartao = location.state?.cartao;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentAgendamento = useSelector(
    (state: RootState) => state.agendamento.currentAgendamento
  );

  useEffect(() => {
    if (!currentAgendamento) {
      alert("Nenhum agendamento encontrado!");
      navigate("/MonitoriaJa/lista-agendamentos");
    }
    if (!cartao) {
      alert("Nenhum cartão selecionado!");
      navigate("/MonitoriaJa/lista-cartao");
    }
  }, [currentAgendamento, cartao, navigate]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/MonitoriaJa/lista-agendamentos");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleConfirmarPagamento = async () => {
    if (!currentAgendamento) {
      setError("Nenhum agendamento encontrado!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const novoAgendamento = {
        ...currentAgendamento,
        statusPagamento: "PAGO" as const,
        formaPagamento: "CARTAO" as const,
        status: "CONFIRMADO" as const,
      };

      const agendamentoCriado = await criarAgendamento(novoAgendamento);
      dispatch(addAgendamento(agendamentoCriado));
      setSuccess(true);
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setError("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/MonitoriaJa/lista-cartao");
  };

  if (success) {
    return (
      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Alert
          severity="success"
          sx={{
            width: "100%",
            maxWidth: 400,
            bgcolor: "primary.main",
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            alignItems: "center",
            py: 3,
            boxShadow: 4,
            letterSpacing: 1,
            textAlign: "center",
          }}
          iconMapping={{
            success: (
              <CreditCardIcon sx={{ fontSize: 50, mr: 2, color: "#ffffff" }} />
            ),
          }}
        >
          Pagamento realizado com sucesso!
        </Alert>
      </main>
    );
  }

  if (error) {
    return (
      <main
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <Alert
          severity="error"
          sx={{
            width: "100%",
            maxWidth: 400,
            fontSize: "1.2rem",
            py: 3,
            boxShadow: 4,
            textAlign: "center",
          }}
        >
          {error}
          <Box sx={{ mt: 2 }}>
            <ConfirmationButton onClick={() => setError(null)}>
              Tentar novamente
            </ConfirmationButton>
          </Box>
        </Alert>
      </main>
    );
  }

  const orderId = currentAgendamento ? `#${currentAgendamento.id}` : '#0000';

  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Confirmar Pagamento" />
        <div className={styles.infoText}>Pedido {orderId}</div>

        <CartaoItem
          numero={cartao.ultimosDigitos}
          nome={cartao.titular}
          bandeira={cartao.bandeira}
          mostrarBotoes={false}
        />

        <Box className={styles.buttonGroup}>
          <ConfirmationButton
            onClick={handleConfirmarPagamento}
            disabled={loading}
          >
            {loading ? "Processando..." : "Confirmar Pagamento"}
          </ConfirmationButton>
          <ConfirmationButton onClick={handleCancel} disabled={loading}>
            Cancelar
          </ConfirmationButton>
        </Box>
      </Box>
    </main>
  );
};

export default ConfirmaPagamentoPage;