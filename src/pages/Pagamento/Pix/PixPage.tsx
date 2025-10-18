import React, { useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import ConfirmationButton from "../../botaoTemporario/botaoTemporario";
import styles from "./PixPage.module.css";
import Title from "../../AlterarSenha/Titulo/Titulo";

const PixPage: React.FC = () => {
  const orderId = "#0000";
  const orderValue = "R$ 00,00";
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/MonitoriaJa/lista-agendamentos");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleCopyPixCode = () => {
    setSuccess(true);
    // ...código para copiar, se necessário...
  };

  const handleCancel = () => {
    navigate("/MonitoriaJa/agendamento-monitor");
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
              <QrCode2Icon sx={{ fontSize: 50, mr: 2, color: "#ffffff" }} />
            ),
          }}
        >
          Pagamento realizado com sucesso!
        </Alert>
      </main>
    );
  }

  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Pix" />
        <Typography className={styles.infoText}>Pedido {orderId}</Typography>
        <Typography className={styles.infoText}>
          Valor de compra: {orderValue}
        </Typography>
        <Box className={styles.qrCodeContainer}>
          <QrCode2Icon className={styles.qrCodeIcon} />
        </Box>
        <Box className={styles.buttonGroup}>
          <ConfirmationButton onClick={handleCopyPixCode}>
            Copiar Código Pix
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
