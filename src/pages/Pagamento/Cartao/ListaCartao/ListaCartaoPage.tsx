import React from 'react';
import ConfirmationButton from '../../../../components/login-form/ConfirmationButton';
import styles from './ListaCartaoPage.module.css';
import VisaLogo from '../cartaoTesteUm.png'; // Exemplo de logo
import MastercardLogo from '../cartaoTesteDois.png';
import EloLogo from '../cartaoTesteTres.png';
import Title from '../../../AlterarSenha/Titulo/Titulo';

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

  const getBandeiraLogo = (bandeira: string) => {
    switch (bandeira) {
      case 'Visa':
        return VisaLogo;
      case 'MasterCard':
        return MastercardLogo;
      case 'Elo':
        return EloLogo;
      default:
        return '';
    }
  };

  const maskNumero = (numero: string) => {
    return numero.replace(/\d(?=\d{4})/g, '*'); // Mostra apenas os últimos 4 dígitos
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
      <div className={styles.cardContainer}>
        <Title text="Cartões Cadastrados" />
        {cartoesExemplo.map((cartao) => (
          <div key={cartao.id} className={styles.cartaoCard}>
            <div className={styles.cartaoInfo}>
              <div>
                <p className={styles.numero}>{maskNumero(cartao.numero)}</p>
                <p className={styles.nome}>{cartao.nome}</p>
              </div>
              <img
                src={getBandeiraLogo(cartao.bandeira)}
                alt={cartao.bandeira}
                className={styles.logo}
              />
            </div>
            <div className={styles.buttonGroup}>
              <ConfirmationButton
                className={styles.button}
                onClick={() => console.log('Escolher', cartao.id)}
              >
                Escolher
              </ConfirmationButton>
              <ConfirmationButton
                className={styles.button}
                onClick={() => console.log('Remover', cartao.id)}
              >
                Remover
              </ConfirmationButton>
            </div>
          </div>
        ))}
      </div>
      </div>
    </main>
  );
};

export default ListaCartaoPage;
