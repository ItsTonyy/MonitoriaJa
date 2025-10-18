import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ConfirmationButton from '../botaoTemporario/botaoTemporario';
import DescriptionBox from './Descricao/Descricao';
import CampoFormulario from './CampoFormulario/CampoFormulario';
import UploadButton from './UploadButton/UploadButton';
import StatusModal from '../AlterarSenha/StatusModal/StatusModal';
import PersonIcon from '@mui/icons-material/Person';
import styles from './PerfilMonitorPage.module.css';
import Estrela from '../../../public/five-stars-rating-icon-png.webp';
import AtualizarMateria from './AtualizarMateria/AtualizarMateria';
import { RootState } from '../../redux/root-reducer';
import {
  atualizarDescricao,
  atualizarContato,
  atualizarMaterias,
} from '../../redux/features/perfilMonitor/slice';

const MATERIAS = [
  "Matemática", "Física", "Química", "Biologia", "História",
  "Geografia", "Português", "Inglês", "Programação"
];

const PerfilMonitorPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const monitor = useSelector((state: RootState) => state.perfilMonitor);

  // Local state para inputs
  const [telefoneInput, setTelefoneInput] = useState(monitor.telefone);
  const [emailInput, setEmailInput] = useState(monitor.email);
  const [descricaoInput, setDescricaoInput] = useState(monitor.descricao);
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>(monitor.materias);

  const [erros, setErros] = useState<{ telefone?: string; email?: string }>({});
  const [open, setOpen] = useState(false);

  const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validarCampos = () => {
    const novosErros: { telefone?: string; email?: string } = {};

    if (!telefoneRegex.test(telefoneInput)) {
      novosErros.telefone = 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX';
    }
    if (!emailRegex.test(emailInput)) {
      novosErros.email = 'Email inválido';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = () => {
    if (validarCampos()) {
      dispatch(atualizarContato({ telefone: telefoneInput, email: emailInput }));
      dispatch(atualizarDescricao(descricaoInput));
      dispatch(atualizarMaterias(materiasSelecionadas));
      setOpen(true);
    }
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        {/* Cabeçalho */}
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
              {monitor.nome}
            </div>
          </div>
        </div>

        {/* Foto */}
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

        {/* Avaliação e Formação */}
        <div className={styles.ratingAndFormation}>
          <div className={styles.rating}>
            <img src={Estrela} alt="Estrela" className={styles.starIcon} />
          </div>
          <h4>Formação e Cursos</h4>
        </div>

        {/* Descrição */}
        <div className={styles.descriptionBox}>
          <DescriptionBox
            value={descricaoInput}
            onChange={setDescricaoInput}
            rows={4}
            placeholder="Escreva uma descrição sobre o monitor..."
          />
        </div>

        {/* Campos de Telefone e Email */}
        <div className={styles.fieldsContainer}>
          <CampoFormulario
            label="Telefone"
            value={telefoneInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTelefoneInput(e.target.value)
            }
          />
          {erros.telefone && <span className={styles.error}>{erros.telefone}</span>}

          <CampoFormulario
            label="Email"
            value={emailInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmailInput(e.target.value)
            }
          />
          {erros.email && <span className={styles.error}>{erros.email}</span>}

          {/* Matérias - somente expositivo */}
          <AtualizarMateria
            value={materiasSelecionadas}
            onChange={setMateriasSelecionadas}
            options={MATERIAS}
          />
        </div>

        {/* Botões */}
        <div className={styles.buttonSection}>
          <div className={styles.buttonGroup}>
            <ConfirmationButton onClick={() => navigate('/MonitoriaJa/alterar-senha')}>
              Trocar senha
            </ConfirmationButton>
          </div>

          <div className={styles.buttonGroup}>
            <ConfirmationButton onClick={handleSalvar}>
              Confirmar Mudanças
            </ConfirmationButton>
          </div>

          <div className={styles.buttonGroup}>
            <ConfirmationButton onClick={() => navigate(-1)}>
              Voltar
            </ConfirmationButton>
          </div>
        </div>
      </div>

      {/* Modal de status */}
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
