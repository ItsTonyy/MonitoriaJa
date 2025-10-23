import React, { useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../redux/store";
import { resetStatus, confirmaPagamento } from "../../../../redux/features/listaCartao/slice";
import ConfirmationButton from "../../../botaoTemporario/botaoTemporario";
import styles from "./ConfirmaPagamentoPage.module.css";
import Title from "../../../AlterarSenha/Titulo/Titulo";
import CartaoItem from "../CartaoItem/CartaoItem";

const ConfirmaPagamento: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const cartao = location.state?.cartao;
  const { status, errorMessage } = useSelector((state: RootState) => state.cartoes);

  // Resetar status ao entrar
  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  // Confirmar pagamento
  const handleConfirmar = () => {
    if (!cartao?.id) {
      alert("Nenhum cartão selecionado!");
      return;
    }
    dispatch(confirmaPagamento(cartao.id));
  };

  const handleCancel = () => navigate(-1);

  // Redirecionar após sucesso
  useEffect(() => {
    if (status === "success") {
      const timeout = setTimeout(() => {
        dispatch(resetStatus());
        navigate("/MonitoriaJa/lista-agendamentos");
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [status, dispatch, navigate]);

  /* ---------- Tela de Sucesso ---------- */
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
        >
          Pagamento realizado com sucesso!
        </Alert>
      </main>
    );
  }

  /* ---------- Tela de Erro ---------- */
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
            <ConfirmationButton onClick={() => dispatch(resetStatus())}>
              Tentar novamente
            </ConfirmationButton>
          </Box>
        </Alert>
      </main>
    );
  }

  /* ---------- Tela principal ---------- */
  return (
    <main className={styles.centralizeContent}>
      <Box className={styles.card}>
        <Title text="Cartão" />
        <CartaoItem
          numero={cartao?.numero ?? "************0000"}
          nome={cartao?.nome ?? "Nome não disponível"}
          bandeira={cartao?.bandeira ?? "Visa"}
          mostrarBotoes={false}
        />
        <Box className={styles.buttonGroup}>
          <ConfirmationButton onClick={handleConfirmar}>
            {status === "loading" ? "Processando..." : "Confirmar Pagamento"}
          </ConfirmationButton>
          <ConfirmationButton onClick={handleCancel}>Cancelar</ConfirmationButton>
        </Box>
      </Box>
    </main>
  );
};

export default ConfirmaPagamento;
