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
import { uploadArquivo } from "../../redux/features/upload/fetch";
import { Button } from "@mui/material";
import { adicionarMonitorNaDisciplina } from "../../redux/features/disciplina/fetch";


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
  const [uploadingFoto, setUploadingFoto] = useState(false);
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
    if (!isAuthenticated()) {
      dispatch(clearCurrentMonitor());
      navigate('/MonitoriaJa/login');
      return;
    }

    const targetMonitorId = monitorId || getUserIdFromToken();
    
    if (targetMonitorId) {
      dispatch(fetchMonitor(String(targetMonitorId)));
      dispatch(fetchDisciplinas());
    } else {
      navigate("/MonitoriaJa/login");
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, navigate, monitorId]);

  // CORREÇÃO: Atualizar estados locais quando monitor é carregado
  useEffect(() => {
    if (monitor) {
      setTelefoneInput(monitor.telefone || "");
      setEmailInput(monitor.email || "");
      setDescricaoInput(monitor.biografia || "");
      
      // CORREÇÃO: Usar as matérias do monitor (já devem vir sincronizadas do slice)
      if (monitor.materia && monitor.materia.length > 0) {
        console.log('✅ [PerfilMonitorPage] Carregando matérias do monitor:', monitor.materia);
        setMateriasSelecionadas(monitor.materia);
      }
      
      setFotoUrl(monitor.foto || "");

      if (nomeRef.current) {
        nomeRef.current.textContent = monitor.nome || "";
      }
      setNomeInput(monitor.nome || "");
    }
  }, [monitor]);

  // CORREÇÃO: Sincronizar matérias quando as disciplinas estiverem carregadas
  useEffect(() => {
    if (monitor && materiasDisponiveis.length > 0 && monitor.listaDisciplinas) {
      // Se o monitor tem listaDisciplinas (IDs), converter para nomes
      const materiasNomes = monitor.listaDisciplinas
        .map((disciplinaId: string) => {
          const disciplina = materiasDisponiveis.find(d => d.id === disciplinaId);
          return disciplina?.nome;
        })
        .filter(Boolean) as string[];
      
      // CORREÇÃO: Só atualizar se as matérias forem diferentes
      if (materiasNomes.length > 0 && JSON.stringify(materiasNomes) !== JSON.stringify(materiasSelecionadas)) {
        console.log('🔄 [PerfilMonitorPage] Sincronizando matérias do banco:', materiasNomes);
        setMateriasSelecionadas(materiasNomes);
        dispatch(atualizarMaterias(materiasNomes));
      }
    }
  }, [monitor, materiasDisponiveis, materiasSelecionadas, dispatch]);

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

  // CORREÇÃO: Filtrar opções para mostrar apenas matérias NÃO selecionadas
  const opcoesMaterias = materiasDisponiveis
    .map((disciplina) => disciplina.nome)
    .filter(nome => !materiasSelecionadas.includes(nome));

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

  const handleFileSelect = async (file: File) => {
    console.log('📤 Arquivo selecionado:', file.name);

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFotoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setFotoFile(file);
    }
  };

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

    const hasValidationErrors = Object.values(validationErrors).some(
      (err) => err !== undefined
    );

    if (hasValidationErrors) {
      return;
    }

    try {
      console.log('📤 Fazendo upload da foto se necessário...');
      
      let fotoUrlFinal = monitor.foto;
      if (fotoFile) {
        setUploadingFoto(true);
        console.log('📸 Iniciando upload da foto...');
        fotoUrlFinal = await uploadArquivo(fotoFile);
        console.log('✅ Upload da foto concluído:', fotoUrlFinal);
        setUploadingFoto(false);
      }

      console.log('📤 Despachando updateMonitor com matérias:', materiasSelecionadas);
      
      await dispatch(
        updateMonitor({
          nome: nomeFinal,
          telefone: telefoneInput,
          email: emailInput,
          biografia: descricaoInput,
          materia: materiasSelecionadas,
          fotoUrl: fotoUrlFinal,
        })
      ).unwrap();

      const monitorIdValue = monitor.id;
      const disciplinasAdicionadas = materiasSelecionadas.filter(
        (nome) =>
          !(monitor.materia || []).includes(nome) &&
          !(monitor.listaDisciplinas || []).some((id) => {
            const disciplina = materiasDisponiveis.find(d => d.id === id || d.id === id);
            return disciplina?.nome === nome;
          })
      );

      // Pegue os ids das disciplinas adicionadas
      const disciplinasIds = materiasDisponiveis
        .filter((d) => disciplinasAdicionadas.includes(d.nome!))
        .map((d) => d.id);

      for (const disciplinaId of disciplinasIds) {
        if (disciplinaId && monitorIdValue) {
          await adicionarMonitorNaDisciplina(disciplinaId, monitorIdValue);
        }
      }

      dispatch(
        atualizarContato({ telefone: telefoneInput, email: emailInput })
      );
      dispatch(atualizarDescricao(descricaoInput));
      dispatch(atualizarMaterias(materiasSelecionadas));

      setOpen(true);
      setHasSubmitted(false);
      setFotoFile(null);
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

          {/* CORREÇÃO: O dropdown mostra apenas matérias NÃO selecionadas */}
          <AtualizarMateria
            value={[]} // Sempre vazio porque as selecionadas já estão fixas acima
            onChange={(novasMaterias) => {
              // Adiciona as novas matérias às já selecionadas
              const todasMaterias = [...materiasSelecionadas, ...novasMaterias];
              setMateriasSelecionadas(todasMaterias);
            }}
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
          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <ModalAgendamento onClose={handleClose} />
          </Modal>

          <div className={styles.buttonGroup}>
            <Button
              onClick={handleOpen}
              variant="contained"
              disabled={loading || uploadingFoto}
              sx={{
                padding: "6px 0",
                borderRadius: "6px",
                gridArea: "box-1"
              }}
            >
              Gerenciar Disponibilidade
            </Button>

            <Button 
              onClick={() => {
                const loggedUserId = getUserIdFromToken();
                
                if (monitorId && monitorId !== loggedUserId) {
                  navigate(`/MonitoriaJa/alterar-senha/${monitorId}`);
                } else {
                  navigate('/MonitoriaJa/alterar-senha');
                }
              }}
              disabled={loading || uploadingFoto}
              variant="contained"
              sx={{
                padding: "6px 0",
                borderRadius: "6px",
                gridArea: "box-2"
              }}
            >
              Alterar senha
            </Button>

            <Button 
              onClick={() => navigate(-1)}
              variant="outlined"
              disabled={loading || uploadingFoto}
              sx={{
                padding: "6px 0",
                borderRadius: "6px",
                gridArea: "box-3",
              }}
            >
              Voltar
            </Button>

            <Button
              onClick={handleSalvar}
              disabled={loading || uploadingFoto}
              variant="contained"
              sx={{
                background: "#104c91",
                color: "#fff",
                padding: "6px 0",
                fontWeight: "bold",
                borderRadius: "6px",
                gridArea: "box-4",
                "&:hover": {
                  background: "#125a9e",
                },
                "&:disabled": {
                  background: "#9bb9d7",
                  color: "#eee",
                },
              }}
            >
              {loading ? "SALVANDO..." : "SALVAR"}
            </Button>
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