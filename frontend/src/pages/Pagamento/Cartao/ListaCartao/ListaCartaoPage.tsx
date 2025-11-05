import React, { useEffect } from "react";
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

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Seleciona os cartões do estado Redux
  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));
  
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

  const handleCancel = () => {
    navigate("/MonitoriaJa/agendamento-monitor");
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Cartões Cadastrados" />
        <div className={styles.cardContainer}>
          {cartoes.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              Nenhum cartão cadastrado. Cadastre um novo cartão para continuar.
            </p>
          ) : (
            cartoes.map((cartao) => (
              <CartaoItem
                key={cartao.id}
                numero={cartao.numero}
                nome={cartao.nome}
                bandeira={cartao.bandeira}
                mostrarBotoes={true}
                onEscolher={() => handleEscolherCartao(cartao)}
                onRemover={() => dispatch(removerCartao(cartao.id))}
              />
            ))
          )}
        </div>
        <ConfirmationButton
          onClick={() => navigate("/MonitoriaJa/cadastra-cartao")}
        >
          Cadastrar Novo Cartão
        </ConfirmationButton>
        <ConfirmationButton onClick={handleCancel}>
          Cancelar
        </ConfirmationButton>
      </div>
    </main>
  );
};

export default ListaCartaoPage;