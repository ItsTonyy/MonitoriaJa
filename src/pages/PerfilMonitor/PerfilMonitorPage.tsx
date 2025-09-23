import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReusableButton from '../../components/common/ReusableButton';
import styles from './PerfilMonitorPage.module.css';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';



/*import { Box, Container } from "@mui/material"; USAR ESSA BIBLIOTECA*/


const PerfilMonitorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className={`container flex-grow-1 ${styles.centralizeContent}`}>
      <div className={styles.profileCard}>
        {/* Informações principais do perfil */}
        <div className={styles.profileHeader}>
          <div className={styles.nameAndEdit}>
            <input
              type="text"
              className={styles.editableInput}
              defaultValue="Monitor X"
            />
          </div>
          <div className={styles.subjectAndEdit}>
            <input
              type="text"
              className={styles.editableInput}
              defaultValue="Matéria X"
            />
          </div>
        </div>

        {/* **Ajuste aqui para centralizar o ícone** */}
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            <PersonIcon className={styles.profilePhotoIcon} />
          </div>
          <div className={styles.uploadButtonContainer}>
            <ReusableButton
              text="Upload foto"
              className={styles.reusableButton}
            />
          </div>
        </div>

        {/* Avaliação e formação */}
        <div className={styles.ratingAndFormation}>
          <div className={styles.rating}>
            <StarIcon className={styles.starIcon} />
            <span>- X/5</span>
          </div>
          <h4>Formação e Cursos</h4>
        </div>

        {/* Descrição do monitor */}
        <div className={styles.descriptionBox}>
          <textarea
            className={styles.editableTextarea}
            rows={4}
            defaultValue="O Monitor X é especialista em áreas relacionadas ao ensino e ao apoio pedagógico."
          />
        </div>

        {/* Botões de ação */}
        <div className={styles.buttonSection}>
          <div className={styles.buttonGroup}>
            <ReusableButton
              text="Atualizar horários"
              className={styles.reusableButton}
            />
            <ReusableButton
              text="Trocar senha"
              className={styles.reusableButton}
            />
          </div>
          <ReusableButton
            text="Atualizar matérias"
            className={styles.reusableButton}
          />
          <ReusableButton
            text="Voltar"
            className={styles.reusableButton}
            onClick={() => navigate('/lista-agendamentos')}
          />
        </div>
      </div>
    </main>
  );
};

export default PerfilMonitorPage;