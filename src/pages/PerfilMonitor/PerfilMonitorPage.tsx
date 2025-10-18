import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { AppDispatch } from '../../redux/store';
import {
  fetchMonitor,
  updateMonitor
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

  // Estados locais para inputs
  const [telefoneInput, setTelefoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [descricaoInput, setDescricaoInput] = useState('');
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);

  const [erros, setErros] = useState<{ telefone?: string; email?: string }>({});
  const [open, setOpen] = useState(false);

  // Buscar dados do monitor ao carregar a página
  useEffect(() => {
    if (authUser && authUser.id) {
      const userId = Number(authUser.id);
      dispatch(fetchMonitor(userId));
    } else {
      navigate('/MonitoriaJa/login');
    }
  }, [dispatch, navigate, authUser]);

  // Atualizar estados locais quando o monitor for carregado
  useEffect(() => {
    if (monitor) {
      setTelefoneInput(monitor.telefone || '');
      setEmailInput(monitor.email || '');
      setDescricaoInput(monitor.descricao || '');
      setMateriasSelecionadas(monitor.materias || []);
    }
  }, [monitor]);

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

  const handleSalvar = async () => {
    if (validarCampos() && monitor) {
      try {
        await dispatch(updateMonitor({
          telefone: telefoneInput,
          email: emailInput,
          descricao: descricaoInput,
          materias: materiasSelecionadas
        })).unwrap();
        setOpen(true);
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    }
  };

  const handleExcluirMateria = (materiaToDelete: string) => {
    const novasMaterias = materiasSelecionadas.filter(materia => materia !== materiaToDelete);
    setMateriasSelecionadas(novasMaterias);
  };

  if (loading) return <div className={styles.centralizeContent}>Carregando...</div>;

  if (!monitor) return (
    <div className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <p>Monitor não encontrado</p>
        <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>
          Fazer Login
        </ConfirmationButton>
      </div>
    </div>
  );

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