import React, { useState } from 'react';
import ConfirmationButton from '../../components/login-form/ConfirmationButton'; 
import styles from './AlterarSenhaPage.module.css'; 
import { useNavigate } from 'react-router-dom'; 
import CampoFormulario from '../PerfilMonitor/CampoFormulario/CampoFormulario';
import Title from './Titulo/Titulo';
import StatusModal from './StatusModal/StatusModal';

const AlterarSenhaPage: React.FC = () => { 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Alterar Senha" />

        <div className={styles.fieldsContainer}>
          <CampoFormulario label="Senha anterior" defaultValue="123" />
          <CampoFormulario label="Nova senha" defaultValue="234" />
          <CampoFormulario label="Confirme sua Senha" defaultValue="234" />
        </div>
        
        <div className={styles.buttonSection}>
          <ConfirmationButton
            className={styles.reusableButton}
            onClick={() => setOpen(true)} 
          >
            Trocar senha
          </ConfirmationButton>
          <ConfirmationButton
            className={styles.reusableButton}
            onClick={() => navigate(-1)}
          >
            Voltar
          </ConfirmationButton>
        </div>
      </div>

      {/* 🔹 Modal precisa estar dentro do JSX */}
      <StatusModal
        open={open}
        onClose={() => setOpen(false)}
        status="sucesso" 
        mensagem="Senha alterada com sucesso!"
      />
    </main>
  );
}; 

export default AlterarSenhaPage;
