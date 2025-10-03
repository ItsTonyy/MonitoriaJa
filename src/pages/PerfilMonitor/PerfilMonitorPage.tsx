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
import StatusModal from '../AlterarSenha/StatusModal/StatusModal';


const PerfilMonitorPage: React.FC = () => {
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  // Estados para inputs e modal
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [erros, setErros] = useState<{ telefone?: string; email?: string }>({});
  const [open, setOpen] = useState(false);

  // Regex para telefone e email
  const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/; // (XX) 9XXXX-XXXX
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validarCampos = () => {
    const novosErros: { telefone?: string; email?: string } = {};

    if (!telefoneRegex.test(telefone)) {
      novosErros.telefone = 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX';
    }

    if (!emailRegex.test(email)) {
      novosErros.email = 'Email inválido';
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = () => {
    if (validarCampos()) {
      console.log('Dados salvos:', { telefone, email });
      setOpen(true);
    }
  };



  // Dropdown Horários
  const [anchorHorarios, setAnchorHorarios] = useState<null | HTMLElement>(null);
  const openHorarios = Boolean(anchorHorarios);
  const handleClickHorarios = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorHorarios(event.currentTarget);
  };
  const handleCloseHorarios = () => {
    setAnchorHorarios(null);
  };
 
  const [buscaMateriaMultiplas, setBuscaMateriaMultiplas] = useState<string[]>([]);

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
          <CampoFormulario
            label="Telefone"
            value={telefone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTelefone(e.target.value)
            }
          />
          {erros.telefone && (
            <span className={styles.error}>{erros.telefone}</span>
          )}

          <CampoFormulario
            label="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          {erros.email && (
            <span className={styles.error}>{erros.email}</span>
          )}
<AtualizarMateria
  value={buscaMateriaMultiplas}
  onChange={setBuscaMateriaMultiplas}
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
            className={styles.reusableButton}
            onClick={handleSalvar}
          >
            Confirmar Mudanças
          </ConfirmationButton>                    
          <ConfirmationButton
            className={styles.reusableButtonFull}
            onClick={() => navigate(-1)}
          >
            Voltar
          </ConfirmationButton>
        </div>
      </div>

      <StatusModal
        open={open}
        onClose={() => setOpen(false)}
        status="sucesso"
        mensagem="Alterações salvas com sucesso!"
      />

    </main>
  );
};

export default PerfilMonitorPage;
