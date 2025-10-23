import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Box, 
  Menu, 
  MenuItem, 
  Select, 
  Checkbox, 
  InputLabel, 
  OutlinedInput, 
  ListItemText,
  SelectChangeEvent 
} from '@mui/material';
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
  updateMonitor, 
  validateField, 
  clearValidationErrors, 
  clearError,
  atualizarDescricao,
  atualizarContato,
  atualizarMaterias,
  atualizarDisponibilidades
} from '../../redux/features/perfilMonitor/slice';

// Definindo a interface Disponibilidade corretamente
export interface Disponibilidade {
  dia: string;
  horarios: string[];
}

const MATERIAS = [
  "Matemática",
  "Física",
  "Química",
  "Biologia",
  "História",
  "Geografia",
  "Português",
  "Inglês",
  "Programação"
];

const HORARIOS = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

const DIAS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const PerfilMonitorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Redux state
  const authUser = useSelector((state: RootState) => state.login.user);
  const monitor = useSelector((state: RootState) => state.perfilMonitor.currentMonitor);
  const loading = useSelector((state: RootState) => state.perfilMonitor.loading);
  const error = useSelector((state: RootState) => state.perfilMonitor.error);
  const validationErrors = useSelector((state: RootState) => state.perfilMonitor.validationErrors);
  
  // Local state para inputs
  const [nomeInput, setNomeInput] = useState('');
  const [telefoneInput, setTelefoneInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [descricaoInput, setDescricaoInput] = useState('');
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);
  const [fotoUrl, setFotoUrl] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // Estado para disponibilidades (do segundo código)
  const [dias, setDias] = useState<string[]>([]);
  const [horariosPorDia, setHorariosPorDia] = useState<Record<string, string[]>>({});
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>([]);
  const [erros, setErros] = useState<{ telefone?: string; email?: string }>({});

  // Regex de validação (do segundo código)
  const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      setFotoUrl(monitor.fotoUrl || '');
      setDisponibilidades(monitor.listaDisponibilidades || []);
      
      // Inicializar dias e horários baseado nas disponibilidades existentes
      if (monitor.listaDisponibilidades && monitor.listaDisponibilidades.length > 0) {
        const diasFromDisponibilidades = monitor.listaDisponibilidades.map(d => d.dia);
        setDias(diasFromDisponibilidades);
        
        const horariosFromDisponibilidades: Record<string, string[]> = {};
        monitor.listaDisponibilidades.forEach(d => {
          horariosFromDisponibilidades[d.dia] = d.horarios || [];
        });
        setHorariosPorDia(horariosFromDisponibilidades);
      }
    }
  }, [monitor]);

  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [nomeInput, telefoneInput, emailInput, descricaoInput, materiasSelecionadas, error, dispatch]);

  // Atualizar disponibilidades quando dias ou horariosPorDia mudam
  useEffect(() => {
    const novasDisponibilidades = dias.map((dia) => ({
      dia,
      horarios: horariosPorDia[dia] ?? []
    }));
    setDisponibilidades(novasDisponibilidades);
  }, [dias, horariosPorDia]);

  // Handlers do primeiro código
  const handleNomeChange = (value: string) => {
    setNomeInput(value);
    if (hasSubmitted) dispatch(validateField({ field: 'nome', value }));
  };

  const handleTelefoneChange = (value: string) => {
    setTelefoneInput(value);
    if (hasSubmitted) dispatch(validateField({ field: 'telefone', value }));
  };

  const handleEmailChange = (value: string) => {
    setEmailInput(value);
    if (hasSubmitted) dispatch(validateField({ field: 'email', value }));
  };

  const handleDescricaoChange = (value: string) => {
    setDescricaoInput(value);
    if (hasSubmitted) dispatch(validateField({ field: 'descricao', value }));
  };

  // Handlers do segundo código para disponibilidades
  const handleChangeDias = (event: SelectChangeEvent<typeof dias>) => {
    const { value } = event.target;
    const novosDias = typeof value === "string" ? value.split(",") : value;
    setDias(novosDias);
    setHorariosPorDia((prev) => {
      const atualizado: Record<string, string[]> = {};
      novosDias.forEach((d) => {
        atualizado[d] = prev[d] ?? [];
      });
      return atualizado;
    });
  };

  const handleChangeHorariosPorDia = (dia: string) => (event: SelectChangeEvent<string[]>) => {
    const val = event.target.value as unknown as string[] | string;
    const selecionados = typeof val === "string" ? val.split(",") : (val as string[]);
    setHorariosPorDia((prev) => ({
      ...prev,
      [dia]: selecionados
    }));
  };

  // Validação do segundo código
  const validarCampos = () => {
    const novosErros: { telefone?: string; email?: string } = {};
    if (!telefoneRegex.test(telefoneInput)) {
      novosErros.telefone = "Telefone inválido. Use o formato (XX) 9XXXX-XXXX";
    }
    if (!emailRegex.test(emailInput)) {
      novosErros.email = "Email inválido";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleExcluirMateria = (materiaToDelete: string) => {
    const novasMaterias = materiasSelecionadas.filter(m => m !== materiaToDelete);
    setMateriasSelecionadas(novasMaterias);
  };

  // Upload da foto
  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSalvar = async () => {
    if (!monitor) return;
    
    setHasSubmitted(true);
    
    // Validações do primeiro código
    dispatch(validateField({ field: 'nome', value: nomeInput }));
    dispatch(validateField({ field: 'telefone', value: telefoneInput }));
    dispatch(validateField({ field: 'email', value: emailInput }));
    dispatch(validateField({ field: 'descricao', value: descricaoInput }));
    
    // Validações do segundo código
    const camposValidos = validarCampos();
    
    const hasValidationErrors = Object.values(validationErrors).some(err => err !== undefined) || !camposValidos;
    
    if (hasValidationErrors) return;

    try {
      await dispatch(updateMonitor({
        nome: nomeInput,
        telefone: telefoneInput,
        email: emailInput,
        descricao: descricaoInput,
        materias: materiasSelecionadas,
        fotoUrl: fotoUrl,
        listaDisponibilidades: disponibilidades
      })).unwrap();
      
      // Atualizações locais do segundo código
      dispatch(atualizarContato({ telefone: telefoneInput, email: emailInput }));
      dispatch(atualizarDescricao(descricaoInput));
      dispatch(atualizarMaterias(materiasSelecionadas));
      dispatch(atualizarDisponibilidades(disponibilidades));
      
      setOpen(true);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  if (loading && !monitor) return <div className={styles.centralizeContent}>Carregando...</div>;
  
  if (error && !monitor) {
    return (
      <div className={styles.centralizeContent}>
        <p>{error}</p>
        <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>Fazer Login</ConfirmationButton>
      </div>
    );
  }

  if (!monitor) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Monitor não encontrado</p>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>Fazer Login</ConfirmationButton>
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
            {hasSubmitted && validationErrors.nome && <span className={styles.error}>{validationErrors.nome}</span>}
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

        {/* Foto */}
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            {fotoUrl ? (
              <img src={fotoUrl} alt="Foto do monitor" className={styles.profilePhoto} />
            ) : (
              <PersonIcon className={styles.profilePhotoIcon} />
            )}
          </div>
          <div className={styles.uploadButtonContainer}>
            <UploadButton onFileSelect={handleFileSelect} />
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
          {hasSubmitted && validationErrors.descricao && <span className={styles.error}>{validationErrors.descricao}</span>}
        </div>

        {/* Campos */}
        <div className={styles.fieldsContainer}>
          {/* Campos do primeiro código */}
          <TextField 
            label="Telefone" 
            variant="outlined" 
            fullWidth 
            value={telefoneInput}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            required
            error={hasSubmitted && (!!validationErrors.telefone || !!erros.telefone)}
            helperText={hasSubmitted ? (validationErrors.telefone || erros.telefone || "") : ""}
            inputProps={{ maxLength: 15 }}
          />
          
          <TextField 
            label="Email" 
            variant="outlined" 
            fullWidth 
            value={emailInput}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            error={hasSubmitted && (!!validationErrors.email || !!erros.email)}
            helperText={hasSubmitted ? (validationErrors.email || erros.email || "") : ""}
          />

          <AtualizarMateria 
            value={materiasSelecionadas} 
            onChange={setMateriasSelecionadas} 
            options={MATERIAS} 
          />

          {/* Seção de disponibilidades do segundo código */}
          <div className="monitor-horarios">
            <InputLabel id="demo-multiple-checkbox-label-dia">Dias Disponíveis</InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label-dia"
              id="demo-multiple-checkbox-label-dia"
              multiple
              value={dias}
              onChange={handleChangeDias}
              input={<OutlinedInput label="Dia" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{ overflow: "auto", minWidth: "100%", maxWidth: "100%" }}
            >
              {DIAS.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={dias.includes(name)} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>

            {dias.map((dia) => (
              <div key={dia} style={{ marginTop: 8 }}>
                <InputLabel id={`label-horarios-${dia}`}>
                  Horários ({dia})
                </InputLabel>
                <Select
                  labelId={`label-horarios-${dia}`}
                  id={`select-horarios-${dia}`}
                  multiple
                  value={horariosPorDia[dia] ?? []}
                  onChange={handleChangeHorariosPorDia(dia)}
                  input={<OutlinedInput label="Horários" />}
                  renderValue={(selected) => (selected as string[]).join(", ")}
                  MenuProps={MenuProps}
                  sx={{ overflow: "auto", minWidth: "100%", maxWidth: "100%" }}
                >
                  {HORARIOS.map((horario) => (
                    <MenuItem key={`${dia}-${horario}`} value={horario}>
                      <Checkbox checked={(horariosPorDia[dia] ?? []).includes(horario)} />
                      <ListItemText primary={horario} />
                    </MenuItem>
                  ))}
                </Select>
              </div>
            ))}
          </div>
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

      {/* Modal */}
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