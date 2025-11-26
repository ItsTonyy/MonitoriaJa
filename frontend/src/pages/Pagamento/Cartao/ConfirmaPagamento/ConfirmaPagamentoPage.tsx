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
  const agendamentoFromState = useSelector(
    (state: RootState) => state.agendamento.currentAgendamento
  );
  
  // Tentar recuperar o agendamento de múltiplas fontes
  const [currentAgendamento, setCurrentAgendamento] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Primeiro tenta do estado do Redux
    if (agendamentoFromState) {
      setCurrentAgendamento(agendamentoFromState);
      return;
    }
    
    // 2. Tenta do sessionStorage
    const agendamentoFromStorage = sessionStorage.getItem('currentAgendamento');
    if (agendamentoFromStorage) {
      try {
        setCurrentAgendamento(JSON.parse(agendamentoFromStorage));
        return;
      } catch (e) {
        console.error('Erro ao parsear agendamento do storage:', e);
      }
    }
    
    // 3. Tenta do location.state (fallback)
    if (location.state?.agendamento) {
      setCurrentAgendamento(location.state.agendamento);
      return;
    }
    
    // 4. Se nenhum encontrado, redireciona
    if (!currentAgendamento) {
      alert("Nenhum agendamento encontrado! Por favor, inicie um novo agendamento.");
      navigate("/MonitoriaJa/agendamento-monitor");
    }
  }, [agendamentoFromState, location.state, navigate]);

  useEffect(() => {
    if (!cartao) {
      alert("Nenhum cartão selecionado!");
      navigate("/MonitoriaJa/lista-cartao");
    }
  }, [cartao, navigate]);

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

    if (!cartao) {
      setError("Nenhum cartão selecionado!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simula processamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const novoAgendamento = {
        ...currentAgendamento,
        statusPagamento: "PAGO" as const,
        formaPagamento: "CARTAO" as const,
        status: "CONFIRMADO" as const,
        cartaoId: cartao._id, // Adiciona ID do cartão usado
      };

      const agendamentoCriado = await criarAgendamento(novoAgendamento);
      dispatch(addAgendamento(agendamentoCriado));
      
      // Limpa o agendamento do storage após sucesso
      sessionStorage.removeItem('currentAgendamento');
      
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
      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}>
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
      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}>
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
            <ConfirmationButton 
              onClick={() => navigate("/MonitoriaJa/agendamento-monitor")}
            >
              Novo Agendamento
            </ConfirmationButton>
          </Box>
        </Alert>
      </main>
    );
  }

  // Mostrar loading enquanto busca o agendamento
  if (!currentAgendamento || !cartao) {
    return (
      <main style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
      }}>
        <Alert severity="info">
          Carregando informações do agendamento...
        </Alert>
      </main>
    );
  }

  const orderId = currentAgendamento.id ? `#${currentAgendamento.id}` : '#Novo';

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