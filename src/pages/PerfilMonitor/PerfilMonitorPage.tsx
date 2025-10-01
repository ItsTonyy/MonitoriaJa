import React, { useState } from 'react';
import ConfirmationButton from '../../components/login-form/ConfirmationButton';
import DescriptionBox from './Descricao/Descricao';
import styles from './PerfilMonitorPage.module.css';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import CampoFormulario from './CampoFormulario/CampoFormulario';
import Estrela from '../../../public/five-stars-rating-icon-png.webp';

const PerfilMonitorPage: React.FC = () => {
  const [description, setDescription] = useState('');
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
              Monitor X
            </div>
            <div
              className={styles.subject}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Matéria do monitor"
              tabIndex={0}
            >
              Matéria X
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

        {/* Avaliação e formação */}
        <div className={styles.ratingAndFormation}>
          <div className={styles.rating}>
            <img src={Estrela} alt="Estrela" className={styles.starIcon} />
          </div>
          <h4>Formação e Cursos</h4>
        </div>

        {/* Descrição */}
        <div className={styles.descriptionBox}>
          <DescriptionBox
            value={description}
            onChange={setDescription}
            rows={4}
            placeholder="Escreva uma descrição sobre o monitor..."
          />
        </div>

        {/* Campos de Telefone e Email */}
        <div className={styles.fieldsContainer}>
          <CampoFormulario label="Telefone" defaultValue="00 00000-0000" />
          <CampoFormulario label="Email" defaultValue="email@exemplo.com" />
        </div>

        {/* Botões */}
        <div className={styles.buttonSection}>
          <div className={styles.buttonGroup}>
            <ConfirmationButton className={styles.reusableButton}>
              Atualizar horários
            </ConfirmationButton>
            <ConfirmationButton className={styles.reusableButton}>
              Atualizar matérias
            </ConfirmationButton>
          </div>
          <ConfirmationButton className={styles.reusableButton}>
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
