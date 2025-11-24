import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@mui/material";
import ConfirmationButton from "../botaoTemporario/botaoTemporario";
import DescriptionBox from "./Descricao/Descricao";
import UploadButton from "./UploadButton/UploadButton";
import StatusModal from "../AlterarSenha/StatusModal/StatusModal";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./PerfilMonitorPage.module.css";
import AtualizarMateria from "./AtualizarMateria/AtualizarMateria";
import { RootState } from "../../redux/root-reducer";
import { AppDispatch } from "../../redux/store";
import {
  fetchMonitor,
  updateMonitor,
  validateField,
  clearError,
  clearCurrentMonitor,
  atualizarDescricao,
  atualizarContato,
  atualizarMaterias,
  fetchDisciplinas,
} from "../../redux/features/perfilMonitor/slice";
import { isAuthenticated, getUserIdFromToken } from '../Pagamento/Cartao/CadastraCartao/authUtils';
import Modal from "@mui/material/Modal";
import ModalAgendamento from "../../components/modais/ModalAgendamento";
import { uploadArquivo } from "../../redux/features/upload/fetch"; // ✅ IMPORTAR uploadArquivo

export interface Disponibilidade {
  dia: string;
  horarios: string[];
}

const PerfilMonitorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { monitorId } = useParams<{ monitorId: string }>();

  const monitor = useSelector(
    (state: RootState) => state.perfilMonitor.currentMonitor
  );
  const loading = useSelector(
    (state: RootState) => state.perfilMonitor.loading
  );
  const error = useSelector((state: RootState) => state.perfilMonitor.error);
  const validationErrors = useSelector(
    (state: RootState) => state.perfilMonitor.validationErrors
  );
  const materiasDisponiveis = useSelector(
    (state: RootState) => state.perfilMonitor.materiasDisponiveis
  );

  // Local state
  const [nomeInput, setNomeInput] = useState("");
  const [telefoneInput, setTelefoneInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [descricaoInput, setDescricaoInput] = useState("");
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);
  const [fotoUrl, setFotoUrl] = useState<string>("");
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false); // ✅ NOVO: estado para upload
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Estado do modal
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  // Ref para o nome
  const nomeRef = useRef<HTMLDivElement | null>(null);

  // Buscar monitor e disciplinas
  useEffect(() => {
    // Verifica se está autenticado
    if (!isAuthenticated()) {
      dispatch(clearCurrentMonitor());
      navigate('/MonitoriaJa/login');
      return;
    }

    // Determina qual monitor buscar (sempre como string)
    const targetMonitorId = monitorId || getUserIdFromToken();
    
    if (targetMonitorId) {
      // Garante que é string
      dispatch(fetchMonitor(String(targetMonitorId)));
      dispatch(fetchDisciplinas());
    } else {
      navigate("/MonitoriaJa/login");
    }

    // Cleanup ao desmontar
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, navigate, monitorId]);

  // Atualizar estados locais quando monitor é carregado
  useEffect(() => {
    if (monitor) {
      setTelefoneInput(monitor.telefone || "");
      setEmailInput(monitor.email || "");
      setDescricaoInput(monitor.biografia || "");
      setMateriasSelecionadas(monitor.materia || []);
      setFotoUrl(monitor.foto || "");

      // Preencher o nome no DOM diretamente
      if (nomeRef.current) {
        nomeRef.current.textContent = monitor.nome || "";
      }
      setNomeInput(monitor.nome || "");
    }
  }, [monitor]);

  // Limpar erro quando campos mudarem
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [
    nomeInput,
    telefoneInput,
    emailInput,
    descricaoInput,
    materiasSelecionadas,
    error,
    dispatch,
  ]);

  // Redirecionar se erro de autenticação
  useEffect(() => {
    if (error && (error.includes('Token') || error.includes('autorizado'))) {
      const timer = setTimeout(() => {
        navigate('/MonitoriaJa/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  // Converter array de objetos {id, nome} para array de strings (nomes)
  const opcoesMaterias = materiasDisponiveis.map(
    (disciplina) => disciplina.nome
  );

  // Handlers
  const handleNomeBlur = () => {
    const newNome = nomeRef.current?.textContent?.trim() || "";
    setNomeInput(newNome);
    if (hasSubmitted)
      dispatch(validateField({ field: "nome", value: newNome }));
  };

  const handleTelefoneChange = (value: string) => {
    setTelefoneInput(value);
    if (hasSubmitted) dispatch(validateField({ field: "telefone", value }));
  };

  const handleEmailChange = (value: string) => {
    setEmailInput(value);
    if (hasSubmitted) dispatch(validateField({ field: "email", value }));
  };

  const handleDescricaoChange = (value: string) => {
    setDescricaoInput(value);
    if (hasSubmitted) dispatch(validateField({ field: "descricao", value }));
  };

  const handleExcluirMateria = (materiaToDelete: string) => {
    const novasMaterias = materiasSelecionadas.filter(
      (m) => m !== materiaToDelete
    );
    setMateriasSelecionadas(novasMaterias);
  };

  // ✅ CORREÇÃO: Seguindo o padrão do cadastro
  const handleFileSelect = async (file: File) => {
    console.log('📤 Arquivo selecionado:', file.name);

    if (file && file.type.startsWith("image/")) {
      // ✅ Cria preview local temporário (igual no cadastro)
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // ✅ Seta o arquivo para upload posterior (igual no cadastro)
      setFotoFile(file);
    }
  };

  // ✅ CORREÇÃO: Seguindo o padrão do cadastro
  const handleSalvar = async () => {
    if (!monitor) return;

    setHasSubmitted(true);

    const nomeFinal = nomeRef.current?.textContent?.trim() || nomeInput;

    // Valida todos os campos
    dispatch(validateField({ field: "nome", value: nomeFinal }));
    dispatch(validateField({ field: "telefone", value: telefoneInput }));
    dispatch(validateField({ field: "email", value: emailInput }));
    if (descricaoInput) {
      dispatch(validateField({ field: "descricao", value: descricaoInput }));
    }

    // Verifica se há erros de validação
    const hasValidationErrors = Object.values(validationErrors).some(
      (err) => err !== undefined
    );

    if (hasValidationErrors) {
      return;
    }

    try {
      console.log('📤 Fazendo upload da foto se necessário...');
      
      // ✅ FAZ UPLOAD DA FOTO PRIMEIRO (igual no cadastro)
      let fotoUrlFinal = monitor.foto;
      if (fotoFile) {
        setUploadingFoto(true);
        console.log('📸 Iniciando upload da foto...');
        fotoUrlFinal = await uploadArquivo(fotoFile);
        console.log('✅ Upload da foto concluído:', fotoUrlFinal);
        setUploadingFoto(false);
      }

      console.log('📤 Despachando updateMonitor...');
      
      await dispatch(
        updateMonitor({
          nome: nomeFinal,
          telefone: telefoneInput,
          email: emailInput,
          biografia: descricaoInput,
          materia: materiasSelecionadas,
          fotoUrl: fotoUrlFinal, // ✅ MUDANÇA: Envia URL da foto, não o arquivo
        })
      ).unwrap();

      dispatch(
        atualizarContato({ telefone: telefoneInput, email: emailInput })
      );
      dispatch(atualizarDescricao(descricaoInput));
      dispatch(atualizarMaterias(materiasSelecionadas));

      setOpen(true);
      setHasSubmitted(false);
      setFotoFile(null); // Limpa o arquivo após salvar
    } catch (err: any) {
      console.error("Erro ao salvar:", err);
      setUploadingFoto(false);
    }
  };

  // Loading
  if (loading && !monitor) {
    return <div className={styles.centralizeContent}>Carregando...</div>;
  }

  // Erro
  if (error && !monitor) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>{error}</p>
          <ConfirmationButton onClick={() => navigate("/MonitoriaJa/login")}>
            Fazer Login
          </ConfirmationButton>
        </div>
      </div>
    );
  }

  // Monitor não encontrado
  if (!monitor) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Monitor não encontrado</p>
          <ConfirmationButton onClick={() => navigate("/MonitoriaJa/login")}>
            Fazer Login
          </ConfirmationButton>
        </div>
      </div>
    );
  }
  
  const userId = getUserIdFromToken();
  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.editableGroup}>
            <div
              ref={nomeRef}
              className={styles.name}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Nome do monitor"
              tabIndex={0}
              onBlur={handleNomeBlur}
            />
            {hasSubmitted && validationErrors.nome && (
              <span className={styles.error}>{validationErrors.nome}</span>
            )}
          </div>
        </div>

        {/* Matérias */}
        {materiasSelecionadas.length > 0 && (
          <div className={styles.materiasAssociadas}>
            <label className={styles.materiasLabel}>Matérias Associadas:</label>
            <div className={styles.materiasChips}>
              {materiasSelecionadas.map((materia, i) => (
                <div key={i} className={styles.materiaChip}>
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

        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            {fotoUrl ? (
              <img
                src={fotoUrl}
                alt="Foto do monitor"
                className={styles.profilePhotoIcon}
              />
            ) : (
              <PersonIcon className={styles.profilePhotoIcon} />
            )}
          </div>
          <div className={styles.uploadButtonContainer}>
            <UploadButton onFileSelect={handleFileSelect} />
            {uploadingFoto && <p className={styles.uploadingText}>Enviando foto...</p>}
          </div>
        </div>

        <div className={styles.ratingAndFormation}>
          <div className={styles.rating}>
            <span className={styles.ratingText}>
              {monitor.avaliacao ?? 0} ★
            </span>
          </div>
          <h4>Formação e Cursos</h4>
        </div>

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

        <div className={styles.fieldsContainer}>
          <TextField
            label="Telefone"
            placeholder="(21) 90000-0000"
            variant="outlined"
            fullWidth
            value={telefoneInput}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            required
            error={hasSubmitted && !!validationErrors.telefone}
            helperText={
              hasSubmitted && validationErrors.telefone
                ? validationErrors.telefone
                : ""
            }
            inputProps={{ maxLength: 15 }}
          />

          <TextField
            label="Email"
            placeholder="seuemail@gmail.com"
            variant="outlined"
            fullWidth
            value={emailInput}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            error={hasSubmitted && !!validationErrors.email}
            helperText={
              hasSubmitted && validationErrors.email
                ? validationErrors.email
                : ""
            }
          />

          <AtualizarMateria
            value={materiasSelecionadas}
            onChange={setMateriasSelecionadas}
            options={opcoesMaterias}
          />
        </div>

        {/* Erro global */}
        {error && (
          <div className={styles.errorContainer}>
            <span className={styles.error}>{error}</span>
          </div>
        )}

        <div className={styles.buttonSection}>
          <div className={styles.buttonGroup}>
            <ConfirmationButton onClick={handleOpen}>
              Gerenciar Disponibilidade
            </ConfirmationButton>
          </div>

          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalAgendamento onClose={handleClose} />
          </Modal>

          <div className={styles.buttonGroup}>
          <ConfirmationButton 
            onClick={() => {
              const targetPath = userId 
                ? `/MonitoriaJa/alterar-senha/${userId}`
                : '/MonitoriaJa/alterar-senha';
              navigate(targetPath);
            }}
          >
            Trocar senha
          </ConfirmationButton>
          </div>
          <div className={styles.buttonGroup}>
            <ConfirmationButton onClick={handleSalvar} disabled={loading || uploadingFoto}>
              {loading ? 'Salvando...' : 'Confirmar Mudanças'}
            </ConfirmationButton>
          </div>
          <div className={styles.buttonGroup}>
            <ConfirmationButton onClick={() => navigate(-1)}>
              Voltar
            </ConfirmationButton>
          </div>
        </div>
      </div>

      <StatusModal
        open={open}
        onClose={() => {
          setOpen(false);
          // Opcional: recarregar dados após sucesso
          if (monitor?.id) {
            dispatch(fetchMonitor(String(monitor.id)));
          }
        }}
        status="sucesso"
        mensagem="Alterações salvas com sucesso!"
      />
    </main>
  );
};

export default PerfilMonitorPage;