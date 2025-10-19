import React, { useEffect, useState } from 'react';
import styles from './ListaCartaoPage.module.css';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import CartaoItem from '../CartaoItem/CartaoItem';
import StatusModal from '../../../AlterarSenha/StatusModal/StatusModal';
import { useNavigate } from 'react-router-dom';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../../redux/store';
import { RootState } from '../../../../redux/root-reducer';
import { selectAllCartoes, resetStatus } from '../../../../redux/features/listaCartao/slice';
import {
  fetchCartoes,
  removerCartao
} from '../../../../redux/features/listaCartao/actions';



const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  const handleCancel = () => {
    navigate(-1);
  };

  // ✅ Seleciona os cartões e estados do Redux
  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));
  const { status, errorMessage, operacao } = useSelector((state: RootState) => state.cartoes);

  // ✅ Carrega os cartões do usuário logado
  useEffect(() => {
    const carregarUsuario = async () => {
      try {
        console.log('🔍 Verificando usuário logado...');

        const usuarioStorage = localStorage.getItem('user');
        console.log('🔍 Conteúdo do localStorage user:', usuarioStorage);

        if (!usuarioStorage) {
          console.error('❌ user não encontrado no localStorage');
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
      }
    };

    carregarUsuario();
  }, [dispatch]);

  // ✅ Filtra cartões por usuário
  const cartoesDoUsuario = cartoes.filter(cartao =>
    usuarioId ? cartao.usuarioId === usuarioId : false
  );

  // ✅ Loading state
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
        <ConfirmationButton onClick={handleCancel}>
          Cancelar
        </ConfirmationButton>
      </div>

      {/* ✅ Modal de Sucesso ao Remover */}
      <StatusModal
        open={status === 'success' && operacao === 'remove'}
        onClose={() => dispatch(resetStatus())}
        status="sucesso"
        mensagem="Cartão removido com sucesso!"
      />

      {/* ✅ Modal de Erro - apenas para operações que falharam */}
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
