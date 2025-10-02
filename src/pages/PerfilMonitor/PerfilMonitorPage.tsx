import React, { useState } from 'react';
import ConfirmationButton from '../../components/login-form/ConfirmationButton';
import DescriptionBox from './Descricao/Descricao';
import styles from './PerfilMonitorPage.module.css';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import CampoFormulario from './CampoFormulario/CampoFormulario';
import { Menu, MenuItem } from '@mui/material';
import Estrela from '../../../public/five-stars-rating-icon-png.webp';
import AtualizarMateria from './AtualizarMateria/AtualizarMateria';
import UploadButton from './UploadButton/UploadButton';


const PerfilMonitorPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  // Dropdown Horários
  const [anchorHorarios, setAnchorHorarios] = useState<null | HTMLElement>(null);
  const openHorarios = Boolean(anchorHorarios);
  const handleClickHorarios = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorHorarios(event.currentTarget);
  };
  const handleCloseHorarios = () => {
    setAnchorHorarios(null);
  };
 
  const [buscaMateria, setBuscaMateria] = useState('');
  const MATERIAS = [
    "Matemática", "Física", "Química", "Biologia", "História",
    "Geografia", "Português", "Inglês", "Programação"
  ];


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
            <UploadButton
              className={styles.uploadButton}
              onFileSelect={(file) => console.log('Arquivo selecionado:', file)}
            />
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
          <AtualizarMateria
          value={buscaMateria}
          onChange={setBuscaMateria}
          options={MATERIAS}
          />



        </div>

        {/* Botões */}
        <div className={styles.buttonSection}>
          {/* Linha 1: dois botões lado a lado */}
          <div className={styles.buttonGroup}>
            <ConfirmationButton
              onClick={handleClickHorarios}
              className={styles.reusableButton}
            >
              Atualizar horários
            </ConfirmationButton>
            <Menu
              anchorEl={anchorHorarios}
              open={openHorarios}
              onClose={handleCloseHorarios}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem onClick={handleCloseHorarios}>Segunda-feira</MenuItem>
              <MenuItem onClick={handleCloseHorarios}>Terça-feira</MenuItem>
              <MenuItem onClick={handleCloseHorarios}>Quarta-feira</MenuItem>
            </Menu>

            <ConfirmationButton
              className={styles.reusableButton}
              onClick={() => navigate('/MonitoriaJa/alterar-senha')}
            >
              Trocar senha
            </ConfirmationButton>
          </div>

          {/* Linha 2: botão Voltar ocupando 100% */}
          <ConfirmationButton
            className={styles.reusableButtonFull}
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
