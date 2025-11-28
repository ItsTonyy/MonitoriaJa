import React from 'react';
import styles from './CartaoItem.module.css';
import VisaLogo from '../Logos/VisaLogo.png';
import MastercardLogo from '../Logos/MasterCardLogo.png';
import EloLogo from '../Logos/EloLogo.png';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import { Button } from '@mui/material';

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
    <Button 
      onClick={onEscolher}
      variant='contained'
      size='small'
      sx={{
        padding: "6px 12px",
        borderRadius: "6px",
      }}
    >
      Escolher
    </Button>

    <Button  
      onClick={onRemover}
      variant='contained'
      color='error'
      size='small'
      sx={{
        padding: "6px 12px",
        borderRadius: "6px",
      }}
    >
      Remover
    </Button>
  </div>
)}

    </div>
  );
};

export default CartaoItem;