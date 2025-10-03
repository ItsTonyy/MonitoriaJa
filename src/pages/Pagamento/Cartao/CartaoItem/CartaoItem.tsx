import React from 'react';
import styles from './CartaoItem.module.css';
import VisaLogo from '../Logos/VisaLogo.png';
import MastercardLogo from '../Logos/MasterCardLogo.png';
import EloLogo from '../Logos/Elologo.png';
import ConfirmationButton from '../../../../components/login-form/ConfirmationButton';

type CartaoProps = {
  numero: string;
  nome: string;
  bandeira: 'Visa' | 'MasterCard' | 'Elo';
  mostrarBotoes?: boolean;            // 🔹 nova prop
  onEscolher?: () => void;
  onRemover?: () => void;
};

const CartaoItem: React.FC<CartaoProps> = ({
  numero,
  nome,
  bandeira,
  mostrarBotoes = true,              // padrão: mostrar os botões
  onEscolher,
  onRemover,
}) => {
  const maskNumero = (numero: string) => numero.replace(/\d(?=\d{4})/g, '*');

  const getBandeiraLogo = () => {
    switch (bandeira) {
      case 'Visa': return VisaLogo;
      case 'MasterCard': return MastercardLogo;
      case 'Elo': return EloLogo;
      default: return '';
    }
  };

  

  return (
    <div className={styles.cartaoCard}>
      <div className={styles.cartaoInfo}>
        <div>
          <p className={styles.numero}>{maskNumero(numero)}</p>
          <p className={styles.nome}>{nome}</p>
        </div>
        <img src={getBandeiraLogo()} alt={bandeira} className={styles.logo} />
      </div>

{mostrarBotoes && (
  <div className={styles.buttonGroup}>
    <ConfirmationButton className={styles.button} onClick={onEscolher}>
      Escolher
    </ConfirmationButton>
    <ConfirmationButton className={styles.button} onClick={onRemover}>
      Remover
    </ConfirmationButton>
  </div>
)}

    </div>
  );
};

export default CartaoItem;