import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  selectCartoesLoading,
  selectCartoesError,
  clearError,
} from "../../../../redux/features/listaCartao/slice";
import { CircularProgress } from "@mui/material";

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));
  const loading = useSelector((state: RootState) => selectCartoesLoading(state));
  const error = useSelector((state: RootState) => selectCartoesError(state));

  const [removendoId, setRemovendoId] = React.useState<string | null>(null);

  const location = useLocation();
const agendamentoFromLocation = location.state?.agendamento;

  useEffect(() => {
    dispatch(fetchCartoes());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

const handleEscolherCartao = (cartao: any) => {
  navigate("/MonitoriaJa/confirma-pagamento", { 
    state: { 
      cartao,
      agendamento: agendamentoFromLocation // ← Usa o do location.state
    } 
  });
};

  const handleRemoverCartao = async (id: string) => {
    if (!id) return;

    setRemovendoId(id);
    try {
      await dispatch(removerCartao(id)).unwrap();
    } catch (err: any) {
      // Erro já está no estado Redux
    } finally {
      setRemovendoId(null);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCadastrarCartao = () => {
    navigate("/MonitoriaJa/cadastra-cartao");
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Cartões Cadastrados" />

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

        {loading && cartoes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <CircularProgress />
          </div>
        ) : (
          <div className={styles.cardContainer}>
            {cartoes.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
                Nenhum cartão cadastrado. Cadastre um novo cartão para continuar.
              </p>
            ) : (
              cartoes.map((cartao: any) => (
                <div
                  key={cartao._id}
                  style={{
                    opacity: removendoId === cartao._id ? 0.5 : 1,
                    pointerEvents: removendoId === cartao._id ? "none" : "auto",
                    transition: "opacity 0.3s",
                  }}
                >
                  <CartaoItem
                    numero={cartao.ultimosDigitos || "••••"}
                    nome={cartao.titular || "Titular não informado"}
                    bandeira={(cartao.bandeira === "Visa" || cartao.bandeira === "MasterCard" || cartao.bandeira === "Elo") 
                      ? cartao.bandeira 
                      : "Visa"}
                    mostrarBotoes={true}
                    onEscolher={() => handleEscolherCartao(cartao)}
                    onRemover={() => handleRemoverCartao(cartao._id)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        <ConfirmationButton
          onClick={handleCadastrarCartao}
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