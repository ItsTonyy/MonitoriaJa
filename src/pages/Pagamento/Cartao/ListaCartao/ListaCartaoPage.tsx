import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { fetchCartoes, removerCartao, resetStatus, selectAllCartoes } from '../../../../redux/features/listaCartao/slice';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import CartaoItem from '../CartaoItem/CartaoItem';
import StatusModal from '../../../AlterarSenha/StatusModal/StatusModal';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import styles from './ListaCartaoPage.module.css';

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));
  const { status, errorMessage, operacao } = useSelector((state: RootState) => state.cartoes);

  useEffect(() => {
    const carregarUsuario = async () => {
      const usuarioStorage = localStorage.getItem('user');
      if (!usuarioStorage) return;
      const usuarioLogado = JSON.parse(usuarioStorage);
      const id = usuarioLogado?.id;
      if (id) {
        setUsuarioId(id);
        await dispatch(fetchCartoes(id));
      }
    };
    carregarUsuario();
  }, [dispatch]);

  const cartoesDoUsuario = cartoes.filter(cartao => usuarioId ? cartao.usuarioId === usuarioId : false);

  if (status === 'loading' && operacao === 'fetch') {
    return (
      <main className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Carregando cartões...</p>
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
              <p className={styles.textoPequeno}>Cadastre um cartão para realizar pagamentos</p>
            </div>
          ) : (
            cartoesDoUsuario.map(cartao => (
              <CartaoItem
                key={cartao.id}
                numero={cartao.numero}
                nome={cartao.nome}
                bandeira={cartao.bandeira}
                mostrarBotoes={true}
                onEscolher={() => navigate('/MonitoriaJa/confirma-pagamento', { state: { cartao } })}
                onRemover={() => dispatch(removerCartao(cartao.id))}
              />
            ))
          )}
        </div>
        <ConfirmationButton onClick={() => navigate('/MonitoriaJa/cadastra-cartao')}>
          Cadastrar Novo Cartão
        </ConfirmationButton>
        <ConfirmationButton onClick={() => navigate(-1)}>Cancelar</ConfirmationButton>
      </div>

      <StatusModal
        open={status === 'success' && operacao === 'remove'}
        onClose={() => dispatch(resetStatus())}
        status="sucesso"
        mensagem="Cartão removido com sucesso!"
      />
      <StatusModal
        open={status === 'error' && operacao !== null}
        onClose={() => dispatch(resetStatus())}
        status="falha"
        mensagem={errorMessage || 'Erro ao processar operação. Tente novamente.'}
      />
    </main>
  );
};

export default ListaCartaoPage;
