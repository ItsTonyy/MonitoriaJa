import React, { useEffect } from 'react';
import styles from './ListaCartaoPage.module.css';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import CartaoItem from '../CartaoItem/CartaoItem';
import { useNavigate } from 'react-router-dom';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../redux/store'; // <-- ajuste se o caminho for diferente
import { RootState } from '../../../../redux/root-reducer';
import {
  fetchCartoes,
  removerCartao,
  selectAllCartoes,
} from '../../../../redux/features/listaCartao/slice';
import reducer from '../../../../redux/features/monitor/monitorSlice';

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Seleciona os cartões do estado Redux
  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));

  // Carrega os cartões ao montar o componente
  useEffect(() => {
    dispatch(fetchCartoes());
  }, [dispatch]);

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
              onEscolher={() =>
                navigate('/MonitoriaJa/confirma-pagamento', { state: { cartao } })
              }
              onRemover={() => dispatch(removerCartao(cartao.id))}
            />
          ))}
        </div>

        <ConfirmationButton
          onClick={() => navigate('/MonitoriaJa/cadastra-cartao')}
        >
          Cadastrar Novo Cartão
        </ConfirmationButton>
      </div>
    </main>
  );
};

export default ListaCartaoPage;
