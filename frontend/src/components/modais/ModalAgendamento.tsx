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
  Snackbar,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useEffect, useState } from "react";
import { Disponibilidade } from "../../models/disponibilidade.model";
import "./ModalAgendamento.css";
import { disponibilidadeService } from "../../services/disponibilidadeService";
import { getUserIdFromToken } from "../../pages/Pagamento/Cartao/CadastraCartao/authUtils";

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

function ModalAgendamento(props: { onClose: () => void }) {

  const [dias, setDias] = useState<string[]>([]);
  console.log(dias);

  const [horariosPorDia, setHorariosPorDia] = useState<
    Record<string, string[]>
  >({});

  console.log(horariosPorDia);

  const [disponibilidades, setDisponibilidades] = useState<Disponibilidade[]>(
    []
  );

  const [existingDisponibilidades, setExistingDisponibilidades] = useState<Disponibilidade[]>([]);
  const [saving, setSaving] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      const monitorId = getUserIdFromToken();
      if (!monitorId) return;
      try {
        const lista = await disponibilidadeService.getByMonitorId(String(monitorId));
        const normalizada = (lista || []).map((d: any) => ({
          id: (d as any).id ?? (d as any)._id,
          usuario: (d as any).usuario,
          day: (d as any).day,
          times: (d as any).times || [],
        }));
        setExistingDisponibilidades(normalizada as Disponibilidade[]);
        const diasIniciais = normalizada
          .map((d) => d.day)
          .filter(Boolean) as string[];
        setDias(diasIniciais);
        const horariosIniciais: Record<string, string[]> = {};
        normalizada.forEach((d) => {
          if (d.day) horariosIniciais[d.day] = d.times || [];
        });
        setHorariosPorDia(horariosIniciais);
        setDisponibilidades(normalizada as Disponibilidade[]);
      } catch (e) {}
    };
    load();
  }, []);

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

  const handleConfirmarDisponibilidade = async () => {
    const monitorId = getUserIdFromToken();
    if (!monitorId) return;
    const novasDisponibilidades: Disponibilidade[] = dias.map((day) => ({
      day,
      times: horariosPorDia[day] ?? [],
    }));
    try {
      setSaving(true);
      const mapExistente = new Map<string, Disponibilidade>();
      existingDisponibilidades.forEach((d) => {
        if (d.day) mapExistente.set(d.day, d);
      });
      const setNovosDias = new Set(novasDisponibilidades.map((d) => d.day));
      for (const nova of novasDisponibilidades) {
        const existente = mapExistente.get(nova.day);
        if (existente && existente.id) {
          const atuais = (existente.times || []).slice().sort().join(",");
          const novos = (nova.times || []).slice().sort().join(",");
          if (atuais !== novos) {
            await disponibilidadeService.update(String(existente.id), {
              times: nova.times || [],
            });
          }
        } else {
          await disponibilidadeService.create({
            usuario: String(monitorId),
            day: nova.day,
            times: nova.times || [],
          });
        }
      }
      for (const existente of existingDisponibilidades) {
        if (existente.day && !setNovosDias.has(existente.day) && existente.id) {
          await disponibilidadeService.remove(String(existente.id));
        }
      }
      setSnackSeverity("success");
      setSnackMessage("Disponibilidade atualizada com sucesso");
      setSnackOpen(true);
      props.onClose();
    } catch (error) {
      setSnackSeverity("error");
      setSnackMessage("Falha ao atualizar disponibilidade");
      setSnackOpen(true);
    } finally {
      setSaving(false);
    }
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
                const times: string[] = horariosPorDia[dia] ?? [];
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
          disabled={disponibilidades.length === 0 || saving}
          onClick={handleConfirmarDisponibilidade}
        >
          Confirmar Disponibilidade
        </Button>
        <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)}>
          <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
            {snackMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default ModalAgendamento;
