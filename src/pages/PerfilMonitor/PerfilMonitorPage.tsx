import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import ConfirmationButton from '../botaoTemporario/botaoTemporario';
import DescriptionBox from './Descricao/Descricao';
import UploadButton from './UploadButton/UploadButton';
import StatusModal from '../AlterarSenha/StatusModal/StatusModal';
import PersonIcon from '@mui/icons-material/Person';
import styles from './PerfilMonitorPage.module.css';
import Estrela from '../../../public/five-stars-rating-icon-png.webp';
import AtualizarMateria from './AtualizarMateria/AtualizarMateria';
import { RootState } from '../../redux/root-reducer';
import { AppDispatch } from '../../redux/store';
import {
  fetchMonitor,
  updateMonitor,
  validateField,
  clearValidationErrors,
  clearError
} from '../../redux/features/perfilMonitor/slice';

const MATERIAS = [
  "Matemática", "Física", "Química", "Biologia", "História",
  "Geografia", "Português", "Inglês", "Programação"
];

const PerfilMonitorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const authUser = useSelector((state: RootState) => state.login.user);
  const monitor = useSelector((state: RootState) => state.perfilMonitor.currentMonitor);
  const loading = useSelector((state: RootState) => state.perfilMonitor.loading);
  const error = useSelector((state: RootState) => state.perfilMonitor.error);
  const validationErrors = useSelector((state: RootState) => state.perfilMonitor.validationErrors);

  // Estados locais para inputs
  const [nomeInput, setNomeInput] = useState('');
  const [telefoneInput, setTelefoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [descricaoInput, setDescricaoInput] = useState('');
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);

  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Buscar dados do monitor ao carregar a página
  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchMonitor(Number(authUser.id)));
    } else {
      navigate('/MonitoriaJa/login');
    }
  }, [dispatch, navigate, authUser]);

  // Atualizar estados locais quando o monitor for carregado
  useEffect(() => {
    if (monitor) {
      setNomeInput(monitor.nome || '');
      setTelefoneInput(monitor.telefone || '');
      setEmailInput(monitor.email || '');
      setDescricaoInput(monitor.descricao || '');
      setMateriasSelecionadas(monitor.materias || []);
    }
  }, [monitor]);

  // Limpar erro global quando o usuário interagir
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [nomeInput, telefoneInput, emailInput, descricaoInput, materiasSelecionadas, error, dispatch]);

  // Handlers com validação
  const handleNomeChange = (value: string) => {
    setNomeInput(value);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'nome', value }));
    }
  };

  const handleTelefoneChange = (value: string) => {
    setTelefoneInput(value);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'telefone', value }));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmailInput(value);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'email', value }));
    }
  };

  const handleDescricaoChange = (value: string) => {
    setDescricaoInput(value);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'descricao', value }));
    }
  };

  const handleSalvar = async () => {
    if (!monitor) return;

    setHasSubmitted(true);

    // Validar todos os campos
    dispatch(validateField({ field: 'nome', value: nomeInput }));
    dispatch(validateField({ field: 'telefone', value: telefoneInput }));
    dispatch(validateField({ field: 'email', value: emailInput }));
    dispatch(validateField({ field: 'descricao', value: descricaoInput }));

    // Verificar se há erros
    const hasValidationErrors = Object.values(validationErrors).some(error => error !== undefined);
    if (hasValidationErrors) {
      return;
    }

    try {
      await dispatch(updateMonitor({
        nome: nomeInput,
        telefone: telefoneInput,
        email: emailInput,
        descricao: descricaoInput,
        materias: materiasSelecionadas
      })).unwrap();
      setOpen(true);
    } catch (error) {
      console.error('Erro ao salvar:', error);
    }
  };

  const handleExcluirMateria = (materiaToDelete: string) => {
    const novasMaterias = materiasSelecionadas.filter(materia => materia !== materiaToDelete);
    setMateriasSelecionadas(novasMaterias);
  };

  // Loading global
  if (loading && !monitor) {
    return <div className={styles.centralizeContent}>Carregando...</div>;
  }

  // Erro global apenas se não conseguir carregar o monitor
  if (error && !monitor) {
    return (
      <div className={styles.centralizeContent}>
        <p>{error}</p>
        <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>
          Fazer Login
        </ConfirmationButton>
      </div>
    );
  }

  // Monitor não encontrado
  if (!monitor) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Monitor não encontrado</p>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>
            Fazer Login
          </ConfirmationButton>
        </div>
      </div>
    );
  }

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
              onBlur={(e) => handleNomeChange(e.currentTarget.textContent || '')}
              onInput={(e) => handleNomeChange(e.currentTarget.textContent || '')}
            >
              {nomeInput}
            </div>
            {hasSubmitted && validationErrors.nome && (
              <span className={styles.error}>{validationErrors.nome}</span>
            )}
          </div>
        </div>

        {/* Display das matérias abaixo do nome */}
        {materiasSelecionadas.length > 0 && (
          <div className={styles.materiasAssociadas}>
            <label className={styles.materiasLabel}>Matérias Associadas:</label>
            <div className={styles.materiasChips}>
              {materiasSelecionadas.map((materia, index) => (
                <div key={index} className={styles.materiaChip}>
                  {materia}
                  <button 
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleExcluirMateria(materia)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
            onChange={handleDescricaoChange}
            rows={4}
            placeholder="Escreva uma descrição sobre o monitor..."
          />
          {hasSubmitted && validationErrors.descricao && (
            <span className={styles.error}>{validationErrors.descricao}</span>
          )}
        </div>

        {/* Campos de Telefone e Email */}
        <div className={styles.fieldsContainer}>
          <TextField
            label="Telefone"
            variant="outlined"
            fullWidth
            value={telefoneInput}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            required
            error={hasSubmitted && !!validationErrors.telefone}
            helperText={hasSubmitted && validationErrors.telefone ? validationErrors.telefone : ""}
            inputProps={{
              maxLength: 15
            }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={emailInput}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            error={hasSubmitted && !!validationErrors.email}
            helperText={hasSubmitted && validationErrors.email ? validationErrors.email : ""}
          />

          {/* Campo para adicionar matérias */}
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
            <ConfirmationButton onClick={handleSalvar} disabled={loading}>
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

      {/* Modal de sucesso */}
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