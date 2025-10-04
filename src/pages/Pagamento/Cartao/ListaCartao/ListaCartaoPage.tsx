import React from 'react';
import styles from './ListaCartaoPage.module.css';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import CartaoItem from '../CartaoItem/CartaoItem';
import { useNavigate } from 'react-router-dom';

type Cartao = {
  id: number;
  numero: string;
  nome: string;
  bandeira: 'Visa' | 'MasterCard' | 'Elo';
};

const cartoesExemplo: Cartao[] = [
  { id: 1, numero: '1234567812345678', nome: 'Rafael Penela', bandeira: 'Visa' },
  { id: 2, numero: '8765432187654321', nome: 'Maria Silva', bandeira: 'MasterCard' },
];

const ListaCartaoPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Cartões Cadastrados" />
        <div className={styles.cardContainer}>
          {cartoesExemplo.map((cartao) => (
            <CartaoItem
              key={cartao.id}
              numero={cartao.numero}
              nome={cartao.nome}
              bandeira={cartao.bandeira}
              mostrarBotoes={true}   // 🔹 botões aparecem
              onEscolher={() => navigate('/MonitoriaJa/confirma-pagamento')}
              onRemover={() => console.log('Remover', cartao.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
};

export default ListaCartaoPage;
