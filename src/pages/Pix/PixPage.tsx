import React from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "./PixPage.module.css";
import ReusableButton from "../../components/common/ReusableButton";

const PagamentoPixPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCopiarCodigo = () => {
    // Simulação: copiar o código PIX (aqui seria a lógica real com navigator.clipboard.writeText)
    alert("Código Pix copiado!");
    navigate("/Telas/listaAgendamentos");
  };

  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.pixCard}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pix
        </Typography>
        <Typography className={styles.infoLabel}>Pedido #0000</Typography>
        <Typography className={styles.infoLabel}>
          Valor de compra: R$ 00,00
        </Typography>

        <Box className={styles.qrCodeSection}>
          <img
            src="/imagens/qrCodeExemplo.jpg"
            alt="QR Code do Pix"
            className={styles.qrCodeImage}
          />
        </Box>

        <Box className={styles.buttonSection}>
          <ReusableButton
            text="Copiar Código Pix"
            className={styles.reusableButton}
            onClick={handleCopiarCodigo}
          />
          <ReusableButton
            text="Cancelar"
            className={`${styles.reusableButton} ${styles.backButton}`}
            onClick={() => navigate("/detalhesMonitor/agendamentoMonitor")}
          />
        </Box>
      </Box>
    </main>
  );
};

export default PagamentoPixPage;
