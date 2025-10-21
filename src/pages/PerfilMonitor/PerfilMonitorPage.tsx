import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfirmationButton from "../botaoTemporario/botaoTemporario";
import DescriptionBox from "./Descricao/Descricao";
import CampoFormulario from "./CampoFormulario/CampoFormulario";
import UploadButton from "./UploadButton/UploadButton";
import StatusModal from "../AlterarSenha/StatusModal/StatusModal";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./PerfilMonitorPage.module.css";
import Estrela from "../../../public/five-stars-rating-icon-png.webp";
import AtualizarMateria from "./AtualizarMateria/AtualizarMateria";
import { RootState } from "../../redux/root-reducer";
import {
  atualizarDescricao,
  atualizarContato,
  atualizarMaterias,
  atualizarDisponibilidades,
} from "../../redux/features/perfilMonitor/slice";
import { DateTimeField } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import { Disponibilidade } from "../../models/disponibilidade.model";

const MATERIAS = [
  "Matemática",
  "Física",
  "Química",
  "Biologia",
  "História",
  "Geografia",
  "Português",
  "Inglês",
  "Programação",
];

const HORARIOS = [
  "00:00",
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const monitor = useSelector((state: RootState) => state.perfilMonitor);

  // Local state para inputs
  const [telefoneInput, setTelefoneInput] = useState(monitor.telefone);
  const [emailInput, setEmailInput] = useState(monitor.email);
  const [descricaoInput, setDescricaoInput] = useState(monitor.descricao);
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>(
    monitor.materias
  );

  const [erros, setErros] = useState<{ telefone?: string; email?: string }>({});
  const [open, setOpen] = useState(false);

  const [dias, setDias] = useState<string[]>([]);
  const [horariosPorDia, setHorariosPorDia] = useState<
    Record<string, string[]>
  >({});
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>(
    []
  );

  console.log(disponibilidades);

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

  const handleChangeHorariosPorDia =
    (dia: string) => (event: SelectChangeEvent<string[]>) => {
      const val = event.target.value as unknown as string[] | string;
      const selecionados =
        typeof val === "string" ? val.split(",") : (val as string[]);
      setHorariosPorDia((prev) => ({ ...prev, [dia]: selecionados }));
    };

  const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    setDisponibilidades(
      dias.map((day) => ({ day, times: horariosPorDia[day] ?? [] }))
    );
  }, [dias, horariosPorDia]);

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

  const handleSalvar = () => {
    if (validarCampos()) {
      dispatch(
        atualizarContato({ telefone: telefoneInput, email: emailInput })
      );
      dispatch(atualizarDescricao(descricaoInput));
      dispatch(atualizarMaterias(materiasSelecionadas));
      dispatch(atualizarDisponibilidades(disponibilidades));
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
              onFileSelect={(file) => console.log("Arquivo selecionado:", file)}
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
          {erros.telefone && (
            <span className={styles.error}>{erros.telefone}</span>
          )}

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

          <div className="monitor-horarios">
            <InputLabel id="demo-multiple-checkbox-label-dia">Dia</InputLabel>
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
                      <Checkbox
                        checked={(horariosPorDia[dia] ?? []).includes(horario)}
                      />
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
            <ConfirmationButton
              onClick={() => navigate("/MonitoriaJa/alterar-senha")}
            >
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
