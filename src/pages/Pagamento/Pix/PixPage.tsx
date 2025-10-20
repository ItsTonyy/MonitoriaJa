import React, { useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import QrCode2Icon from "@mui/icons-material/QrCode2";

import ConfirmationButton from "../../botaoTemporario/botaoTemporario";
import styles from "./PixPage.module.css";
import Title from "../../AlterarSenha/Titulo/Titulo";

import {
  gerarCodigoPix,
  copiarCodigoPix,
  resetPixStatus,
  resetPix,
  setOrderValueFromValorPorHora,
  setOrderId,
} from "../../../redux/features/pix/slice";

import type { AppDispatch } from "../../../redux/store";
import type { RootState } from "../../../redux/root-reducer";

const PixPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux Pix
  const { orderId, orderValue, pixCode, status, errorMessage } = useSelector(
    (state: RootState) => state.pix
  );

  // Redux Agendamento
  const currentAgendamento = useSelector(
    (state: RootState) => state.agendamento.currentAgendamento
  );

  // Atualiza o orderId e orderValue com base no agendamento
  useEffect(() => {
    console.log("currentAgendamento no PixPage:", currentAgendamento);

    if (currentAgendamento) {
      dispatch(setOrderId(`#${currentAgendamento.id}`));

      const valorMonitor = currentAgendamento.monitor?.valorHora ?? 0;
      const valorFormatado = `R$ ${Number(valorMonitor)
        .toFixed(2)
        .replace(".", ",")}`;

      console.log("Valor formatado para orderValue:", valorFormatado);
      dispatch(setOrderValueFromValorPorHora(valorFormatado));
    }
  }, [dispatch, currentAgendamento]);

  // Gerar código PIX ao montar componente
  useEffect(() => {
    if (!pixCode) {
      dispatch(gerarCodigoPix());
    }
  }, [dispatch, pixCode]);

  // Redirecionar após sucesso
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        dispatch(resetPix());
        navigate("/MonitoriaJa/lista-agendamentos");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [status, navigate, dispatch]);

  const handleCopyPixCode = () => {
    if (pixCode) {
      dispatch(copiarCodigoPix(pixCode));
    }
  };

  const handleCancel = () => {
    dispatch(resetPix());
    navigate(-1);
  };

  // Tela de sucesso
  if (status === "success") {
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
              <QrCode2Icon sx={{ fontSize: 50, mr: 2, color: "#ffffff" }} />
            ),
          }}
        >
          Pagamento realizado com sucesso!
        </Alert>
      </main>
    );
  }

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

        <Typography className={styles.infoText}>
          Pedido {orderId || "#0000"}
        </Typography>

        <Typography className={styles.infoText}>
          Valor de compra: {orderValue || "R$ 0,00"}
        </Typography>

        <Box className={styles.qrCodeContainer}>
          {status === "loading" ? (
            <Typography variant="h6">Gerando código PIX...</Typography>
          ) : (
            <QrCode2Icon className={styles.qrCodeIcon} />
          )}
        </Box>

        <Box className={styles.buttonGroup}>
          <ConfirmationButton onClick={handleCopyPixCode}>
            {status === "loading" ? "Processando..." : "Copiar Código Pix"}
          </ConfirmationButton>
          <ConfirmationButton onClick={handleCancel}>
            Cancelar
          </ConfirmationButton>
        </Box>
      </Box>
    </main>
  );
};

export default PixPage;
