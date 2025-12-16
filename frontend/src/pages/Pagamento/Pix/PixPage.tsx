import React, { useEffect } from "react";
import { Box, Typography, Alert, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { addAgendamento } from '../../../redux/features/agendamento/agendamentoSlice';

import ConfirmationButton from "../../botaoTemporario/botaoTemporario";
import styles from "./PixPage.module.css";
import Title from "../../AlterarSenha/Titulo/Titulo";

import {
  gerarCodigoPix,
  copiarCodigoPix,
  resetPixStatus,
  resetPix,
  setOrderId,
} from "../../../redux/features/pix/slice";
import { criarAgendamento } from "../../../redux/features/agendamento/fetch";

import type { AppDispatch } from "../../../redux/store";
import type { RootState } from "../../../redux/root-reducer";
import { useLocation } from "react-router-dom";



const PixPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const currentAgendamento = location.state?.agendamento;
  // Redux Pix
  const { orderId, orderValue, pixCode, status, errorMessage } = useSelector(
    (state: RootState) => state.pix
  );

  /* Redux Agendamento
  const currentAgendamento = useSelector(
    (state: RootState) => state.agendamento.currentAgendamento
  );/*/

  // Resetar status do Pix ao entrar na página
  useEffect(() => {
    dispatch(resetPix());
  }, [dispatch]);

  // Atualiza o orderId com base no agendamento ao entrar na página
  useEffect(() => {
    if (currentAgendamento) {
      dispatch(setOrderId(`#${currentAgendamento.id}`));
    }
  }, [dispatch, currentAgendamento]);

  // Gerar código PIX ao montar componente
  useEffect(() => {
    if (!pixCode) {
      dispatch(gerarCodigoPix());
    }
  }, [dispatch, pixCode]);

  const handleCopyPixCode = async () => {
    if (!currentAgendamento) {
      alert("Nenhum agendamento encontrado!");
      return;
    }

    try {
      // Copia o código PIX
      if (pixCode) {
        await navigator.clipboard.writeText(pixCode);
      }

      // Cria agendamento com status de pago
      const novoAgendamento = {
        ...currentAgendamento,
        statusPagamento: "PAGO" as const,
        formaPagamento: "PIX" as const,
        status: "CONFIRMADO" as const,
      };

      const agendamentoCriado = await criarAgendamento(novoAgendamento);
      dispatch(addAgendamento(agendamentoCriado));

      // Navega para lista de agendamentos
      navigate("/MonitoriaJa/lista-agendamentos");

    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    }
  };

  const handleCancel = () => {
    dispatch(resetPix());
    navigate("/MonitoriaJa/lista-monitores");
  };

  // Tela de erro
  if (status === "error") {
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
          {errorMessage || "Erro ao processar pagamento"}
          <Box sx={{ mt: 2 }}>
            <ConfirmationButton onClick={() => dispatch(resetPixStatus())}>
              Tentar novamente
            </ConfirmationButton>
          </Box>
        </Alert>
      </main>
    );
  }

  // Tela principal
  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Pix" />

        <Box className={styles.qrCodeContainer}>
          {status === "loading" ? (
            <Typography variant="h6">Gerando código PIX...</Typography>
          ) : (
            <QrCode2Icon className={styles.qrCodeIcon} />
          )}
        </Box>

        <Box className={styles.buttonGroup}>
          <Button 
            onClick={handleCopyPixCode}
            disabled={status === "loading"}
            variant="contained"
            sx={{
              padding: "6px 0",
              borderRadius: "6px",
            }}
          >
            {status === "loading" ? "Processando..." : "Copiar Código Pix"}
          </Button>
          <Button 
            onClick={handleCancel}
            disabled={status === "loading"}
            variant="contained"
            color="error"
            sx={{
              padding: "6px 0",
              borderRadius: "6px",
            }}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </main>
  );
};

export default PixPage;