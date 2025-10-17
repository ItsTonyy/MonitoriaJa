import React, { useEffect, useState } from 'react';
import styles from './ListaCartaoPage.module.css';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import CartaoItem from '../CartaoItem/CartaoItem';
import { useNavigate } from 'react-router-dom';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/root-reducer';
import { selectAllCartoes } from '../../../../redux/features/listaCartao/slice';
import {
  fetchCartoes,
  removerCartao
} from '../../../../redux/features/listaCartao/actions';

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [carregando, setCarregando] = useState(true);

  // Seleciona os cartões do estado Redux
  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));

  // Carrega os cartões do usuário logado
  useEffect(() => {
    // No useEffect do ListaCartaoPage - SUBSTITUA:
const carregarUsuario = async () => {
  try {
    console.log('🔍 Verificando usuário logado...');
    
    // ✅ CORREÇÃO: Usar 'user' em vez de 'currentUser'
    const usuarioStorage = localStorage.getItem('user');
    console.log('🔍 Conteúdo do localStorage user:', usuarioStorage);
    
    if (!usuarioStorage) {
      console.error('❌ user não encontrado no localStorage');
      setCarregando(false);
      return;
    }

    const usuarioLogado = JSON.parse(usuarioStorage);
    console.log('🔍 Usuário logado objeto:', usuarioLogado);
    
    const id = usuarioLogado?.id;
    console.log('🔍 usuarioId encontrado:', id);

    if (id) {
      setUsuarioId(id);
      console.log('✅ Buscando cartões do usuário:', id);
      await dispatch(fetchCartoes(id));
    } else {
      console.error('❌ ID do usuário não encontrado no objeto');
    }
  } catch (error) {
    console.error('💥 Erro ao carregar usuário:', error);
  } finally {
    setCarregando(false);
  }
};

    carregarUsuario();
  }, [dispatch]);

  // Filtra cartões por usuário
  const cartoesDoUsuario = cartoes.filter(cartao => 
    usuarioId ? cartao.usuarioId === usuarioId : false
  );

  if (carregando) {
    return (
      <main className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Cartões Cadastrados" />

        <div className={styles.cardContainer}>
          {cartoesDoUsuario.length === 0 ? (
            <div className={styles.semCartoes}>
              <p>Nenhum cartão cadastrado</p>
              <p className={styles.textoPequeno}>
                Cadastre um cartão para realizar pagamentos
              </p>
            </div>
          ) : (
            cartoesDoUsuario.map((cartao) => (
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
            ))
          )}
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