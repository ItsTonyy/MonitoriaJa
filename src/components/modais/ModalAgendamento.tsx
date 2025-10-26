import {
  Box,
  Typography,
  Button,
  InputLabel,
  Select,
  OutlinedInput,
  SelectChangeEvent,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
} from "@mui/material";
import { useAppSelector } from "../../redux/hooks";
import { useEffect, useState } from "react";
import { Disponibilidade } from "../../models/disponibilidade.model";
import "./ModalAgendamento.css";

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

type diaObject = {
  dia: string;
  horarios: string[];
};

function ModalAgendamento(props: { onClose: () => void }) {
  const [dias, setDias] = useState<string[]>([]);
  console.log(dias);

  const [horariosPorDia, setHorariosPorDia] = useState<diaObject[]>([]);

  console.log(horariosPorDia);

  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>(
    []
  );

  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  const handleTimeSlotClick = (day: string | undefined, time: string) => {
    if (!day) return;
    const slotId = `${day}-${time}`;
    setSelectedSlots((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(slotId)) {
        newSet.delete(slotId);
      } else {
        newSet.add(slotId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const novasDisponibilidades = dias.map((day) => ({
      day,
      times: horariosPorDia[day] ?? [],
    }));
    setDisponibilidades(novasDisponibilidades);
  }, [dias, horariosPorDia]);

  const agendamento = useAppSelector(
    (state) => state.agendamento.currentAgendamento
  );

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
      setHorariosPorDia((prev) => ({
        ...prev,
        [dia]: selecionados,
      }));
    };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 24,
        p: 2,
        width: {
          xs: "100%",
          sm: 600,
        },
        minHeight: 380,
        maxWidth: "95vw",
        maxHeight: "90vh",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
        Gerenciar Disponibilidade
      </Typography>

      {
        <div className="outer-tabela">
          <div className="schedule-container">
            {dias.length > 0 &&
              dias.map((dia) => {
                const times: string[] = ((horariosPorDia as any)[dia] ??
                  []) as string[];
                return (
                  <div key={dia} className="day-column">
                    <div className="day-header">{dia}</div>
                    {times.map((time: string) => {
                      return (
                        <div
                          key={time}
                          className="time-slot"
                          onClick={() => handleTimeSlotClick(dia, time)}
                        >
                          {time}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </div>
        </div>
      }

      <div className="monitor-horarios">
        <FormControl sx={{ minWidth: "100%", maxWidth: "100%" }}>
          <InputLabel id="demo-multiple-checkbox-label-dia">
            Dias Disponíveis
          </InputLabel>
          <Select
            labelId="demo-multiple-checkbox-label-dia"
            id="demo-multiple-checkbox-label-dia"
            multiple
            value={dias}
            onChange={handleChangeDias}
            input={<OutlinedInput label="Dias Disponíveis" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
            sx={{
              overflow: "auto",
              minWidth: "100%",
              maxWidth: "100%",
              marginBottom: 2,
            }}
          >
            {DIAS.map((name) => (
              <MenuItem key={name} value={name}>
                <Checkbox checked={dias.includes(name)} />
                <ListItemText primary={name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {dias.map((dia) => (
          <div key={dia} style={{ marginTop: 8 }}>
            <FormControl sx={{ minWidth: "100%", maxWidth: "100%" }}>
              <InputLabel id={`label-horarios-${dia}`}>({dia})</InputLabel>
              <Select
                labelId={`label-horarios-${dia}`}
                id={`select-horarios-${dia}`}
                multiple
                value={horariosPorDia[dia] ?? []}
                onChange={handleChangeHorariosPorDia(dia)}
                input={<OutlinedInput label="XXX" />}
                renderValue={(selected) => (selected as string[]).join(", ")}
                MenuProps={MenuProps}
                sx={{
                  overflow: "auto",
                  minWidth: "100%",
                  maxWidth: "100%",
                  marginBottom: 2,
                }}
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
            </FormControl>
          </div>
        ))}
      </div>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#6b7280 !important",
            "&:hover": { bgcolor: "#374151 !important" },
            minWidth: 120,
            px: 3,
          }}
          onClick={props.onClose}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          sx={{
            minWidth: 120,
            px: 3,
            "&.Mui-disabled": {
              bgcolor: "#f7b3b3 !important",
              color: "#ffffff99",
              opacity: 0.6,
            },
          }}
          /*
            onClick={}
            */
        >
          Confirmar cancelamento
        </Button>
      </Box>
    </Box>
  );
}

export default ModalAgendamento;
