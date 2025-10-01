import React from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

import ConfirmationButton from '../../components/login-form/ConfirmationButton';
import CampoFormulario from '../PerfilMonitor/CampoFormulario/CampoFormulario';
import styles from './PerfilUsuarioPage.module.css';

const PerfilMonitorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>

        {/* Cabeçalho com nome e matéria */}
        <div className={styles.profileHeader}>
          <div className={styles.editableGroup}>
            <div
              className={styles.name}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Nome do monitor"
              tabIndex={0}
            >
              Aluno X
            </div>
          </div>
        </div>

        {/* Foto de perfil */}
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            <PersonIcon className={styles.profilePhotoIcon} />
          </div>
          <div className={styles.uploadButtonContainer}>
            <ConfirmationButton className={styles.reusableButton}>
              Upload foto
            </ConfirmationButton>
          </div>
        </div>

        {/* Campos de Telefone e Email */}
        <div className={styles.fieldsContainer}>
          <CampoFormulario label="Telefone" defaultValue="00 00000-0000" />
          <CampoFormulario label="Email" defaultValue="email@exemplo.com" />
        </div>

        {/* Botões */}
        <div className={styles.buttonSection}>
          <ConfirmationButton
            className={styles.reusableButton}
            onClick={() => navigate("/alterar-senha")}
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
    </main>
  );
};

export default PerfilMonitorPage;