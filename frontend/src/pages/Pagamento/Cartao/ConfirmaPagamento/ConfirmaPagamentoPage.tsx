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

  // Redux Agendamento
  const currentAgendamento = useSelector(
    (state: RootState) => state.agendamento.currentAgendamento
  );

  // Verifica se existe agendamento e cartão
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

  // Redireciona após sucesso
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
      alert("Nenhum agendamento encontrado!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simula processamento do pagamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Atualiza agendamento com dados de pagamento
      const novoAgendamento = {
        ...currentAgendamento,
        statusPagamento: "PAGO" as const,
        formaPagamento: "CARTAO" as const,
        status: "CONFIRMADO" as const,
      };

      // Salva no backend e recebe o agendamento com ID
      const agendamentoCriado = await criarAgendamento(novoAgendamento);

      // CORREÇÃO: Atualiza o Redux com o novo agendamento
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

  // Tela de sucesso
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

  // Tela de erro
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

  // Valores do pedido
  const orderId = currentAgendamento ? `#${currentAgendamento.id}` : '#0000';

  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Confirmar Pagamento" />
        <div className={styles.infoText}>Pedido {orderId}</div>

        <CartaoItem
          numero={cartao?.numero ?? '************0000'}
          nome={cartao?.nome ?? 'Nome não disponível'}
          bandeira={cartao?.bandeira ?? 'Visa'}
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