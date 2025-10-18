import React, { useEffect, useState } from "react";
import styles from "./ListaCartaoPage.module.css";
import Title from "../../../AlterarSenha/Titulo/Titulo";
import CartaoItem from "../CartaoItem/CartaoItem";
import { useNavigate } from "react-router-dom";
import ConfirmationButton from "../../../botaoTemporario/botaoTemporario";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { RootState } from "../../../../redux/root-reducer";
import {
  fetchCartoes,
  removerCartao,
  selectAllCartoes,
} from "../../../../redux/features/listaCartao/slice";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { Alert } from "@mui/material";

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  // Seleciona os cartões do estado Redux
  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));

  // Carrega os cartões ao montar o componente
  useEffect(() => {
    dispatch(fetchCartoes());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/MonitoriaJa/lista-agendamentos");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleEscolherCartao = (cartao: any) => {
    setSuccess(true);
    console.log("cartao escolhido:", cartao);
    // Aqui você pode adicionar lógica de pagamento se necessário
    // navigate("/MonitoriaJa/confirma-pagamento", { state: { cartao } }); // Removido para seguir o novo fluxo
  };

  const handleCancel = () => {
    navigate("/MonitoriaJa/agendamento-monitor");
  };


   if (success) {
    return (
      <main style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "80vh" }}>
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
            success: <CreditCardIcon sx={{ fontSize: 50, mr: 2, color: "#ffffff" }} />,
          }}
        >
          Pagamento realizado com sucesso!
        </Alert>
      </main>
    );
  }
  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Cartões Cadastrados" />

        <div className={styles.cardContainer}>
          {cartoes.map((cartao) => (
            <CartaoItem
              key={cartao.id}
              numero={cartao.numero}
              nome={cartao.nome}
              bandeira={cartao.bandeira}
              mostrarBotoes={true}
              onEscolher={() => handleEscolherCartao(cartao)}
              onRemover={() => dispatch(removerCartao(cartao.id))}
            />
          ))}
        </div>

        <ConfirmationButton
          onClick={() => navigate("/MonitoriaJa/cadastra-cartao")}
        >
          Cadastrar Novo Cartão
        </ConfirmationButton>
        <ConfirmationButton onClick={handleCancel}>Cancelar</ConfirmationButton>
      </div>
    </main>
  );
};

export default ListaCartaoPage;
