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
import { CircularProgress } from "@mui/material";

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Seleciona os cartões do estado Redux
  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));
  const { loading, error } = useSelector((state: RootState) => state.cartoes);
  
  const [removendoId, setRemovendoId] = useState<string | null>(null);
  
  // Verifica se existe agendamento
  const currentAgendamento = useSelector(
    (state: RootState) => state.agendamento.currentAgendamento
  );

  // Carrega os cartões ao montar o componente
  useEffect(() => {
    dispatch(fetchCartoes());
  }, [dispatch]);

  // Verifica se há agendamento
  useEffect(() => {
    if (!currentAgendamento) {
      alert("Nenhum agendamento encontrado!");
      navigate("/MonitoriaJa/agendamento-monitor");
    }
  }, [currentAgendamento, navigate]);

  const handleEscolherCartao = (cartao: any) => {
    // Navega para confirmação de pagamento com o cartão selecionado
    navigate("/MonitoriaJa/confirma-pagamento", { state: { cartao } });
  };

  const handleRemoverCartao = async (id: string) => {
    if (window.confirm("Tem certeza que deseja remover este cartão?")) {
      setRemovendoId(id);
      try {
        await dispatch(removerCartao(id)).unwrap();
        alert("Cartão removido com sucesso!");
      } catch (error) {
        console.error("Erro ao remover cartão:", error);
        alert(
          `Erro ao remover cartão: ${
            error instanceof Error ? error.message : "Tente novamente."
          }`
        );
      } finally {
        setRemovendoId(null);
      }
    }
  };

  const handleCancel = () => {
    navigate("/MonitoriaJa/agendamento-monitor");
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Cartões Cadastrados" />

        {/* Exibe erro se houver */}
        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Exibe loading ao carregar pela primeira vez */}
        {loading && cartoes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <CircularProgress />
            <p style={{ marginTop: "20px", color: "#666" }}>
              Carregando cartões...
            </p>
          </div>
        ) : (
          <div className={styles.cardContainer}>
            {cartoes.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666" }}>
                Nenhum cartão cadastrado. Cadastre um novo cartão para
                continuar.
              </p>
            ) : (
              cartoes.map((cartao) => (
                <div
                  key={cartao.id}
                  style={{
                    opacity: removendoId === cartao.id ? 0.5 : 1,
                    pointerEvents: removendoId === cartao.id ? "none" : "auto",
                    transition: "opacity 0.3s",
                  }}
                >
                  <CartaoItem
                    numero={cartao.ultimosDigitos || cartao.numero || "****"}
                    nome={cartao.titular || ""}
                    bandeira={(cartao.bandeira as "Visa" | "MasterCard" | "Elo") || "Visa"}
                    mostrarBotoes={true}
                    onEscolher={() => handleEscolherCartao(cartao)}
                    onRemover={() => handleRemoverCartao(cartao.id)}
                  />
                  {removendoId === cartao.id && (
                    <p style={{ textAlign: "center", color: "#666", fontSize: "12px", marginTop: "5px" }}>
                      Removendo...
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        <ConfirmationButton
          onClick={() => navigate("/MonitoriaJa/cadastra-cartao")}
          disabled={loading}
        >
          Cadastrar Novo Cartão
        </ConfirmationButton>
        <ConfirmationButton onClick={handleCancel} disabled={loading}>
          Cancelar
        </ConfirmationButton>
      </div>
    </main>
  );
};

export default ListaCartaoPage;