import { useEffect, useState } from "react";
import "./detalhesMonitor.css";
import Button from "@mui/material/Button";
import { useNavigate, useLocation } from "react-router-dom";
import ComentariosAvaliacao from "../comentariosAvaliacao/ComentariosAvaliacao";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Agendamento } from "../../models/agendamento.model";
import type { Usuario } from "../../models/usuario.model";
import { avaliacaoService } from "../../services/avaliacaoService";
import { disponibilidadeService } from "../../services/disponibilidadeService";
import { usuarioService } from "../../services/usuarioService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Box } from "@mui/material";
import dayjs from "dayjs";

/*interface TimeSlot {
  day: "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
  times: string[];
}*/

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function decodeJwtPayload(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    // Corrige padding do base64 se necessário
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

let conquistas: string[] = [
  "Realizou sua primeira monitoria com sucesso.",
  "Concluiu 5 monitorias em sua primeira semana.",
  "Preencheu todas as informações do seu perfil de monitor.",
  "Completou 10 monitorias sem faltas ou atrasos.",
  "Ajudou o mesmo aluno em 3 ou mais sessões.",
  "Recebeu sua primeira avaliação máxima de um aluno.",
  "Acumulou 10 avaliações 5 estrelas.",
  "Realizou 25 monitorias na plataforma.",
  "Realizou 50 monitorias na plataforma.",
  "Realizou 100 monitorias na plataforma.",
  "Realizou 500 monitorias na plataforma.",
  "Realizou 1000 monitorias na plataforma.",
  "Realizou 2000 monitorias na plataforma.",
  "Realizou 3000 monitorias na plataforma.",
  "Realizou 4000 monitorias na plataforma.",
  "Realizou 5000 monitorias na plataforma.",
  "Completou 1 ano como monitor.",
  "Realizou 20 monitorias na mesma matéria.",
  "Deu monitorias em 3 ou mais matérias diferentes.",
  "Concluiu 5 monitorias após a meia-noite.",
  "Ajudou 10 alunos durante um fim de semana.",
];

// Interface não é mais necessária pois usamos Redux

function DetalhesMonitor() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const payload = token ? decodeJwtPayload(token) : null;
  const usuarioId = payload?.id; //  id do usuário logado
  const monitorId = (location.state as any)?.monitorId as string | undefined;
  const monitorFromNav = (location.state as any)?.monitor as
    | Usuario
    | undefined;
  const [monitor, setMonitor] = useState<any | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [horarios, setHorarios] = useState<{ day: string; times: string[] }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [fixedLessons, setFixedLessons] = useState<number>(0);
  const [fixedConquista, setFixedConquista] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const diasSemana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
  const selectedDiaAbbr = selectedDate ? diasSemana[selectedDate.day()] : null;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        let m: any = monitorFromNav;
        if (!m && monitorId) {
          m = await usuarioService.getById(String(monitorId));
        }
        if (!m) return;
        setMonitor(m);
        const monitorKey = (m as any).id ?? (m as any)._id;
        const [avs, disp] = await Promise.all([
          avaliacaoService.getByMonitorId(String(monitorKey)),
          disponibilidadeService.getByMonitorId(String(monitorKey)),
        ]);
        setAvaliacoes(avs || []);
        setHorarios(
          (disp || []).map((d: any) => ({ day: d.day, times: d.times || [] }))
        );
        setFixedLessons(getRandomInt(10, 100));
        setFixedConquista(conquistas[getRandomInt(0, conquistas.length)]);
      } catch (e) {
        console.error("Erro ao carregar dados do monitor:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [monitorId, monitorFromNav]);

  const totalAvaliacoes = avaliacoes.length;
  const somaNotas = avaliacoes.reduce((soma, av) => soma + (av.nota || 0), 0);
  const notaMedia =
    totalAvaliacoes > 0 ? (somaNotas / totalAvaliacoes).toFixed(1) : "0.0";

  // Horários carregados da disponibilidade via serviço
  // Fallback: se serviço não retornar nada, mantém vazio

  useEffect(() => {
    if (!monitorId) {
      navigate("/MonitoriaJa/lista-monitores");
    }
  }, [monitorId, navigate]);

  if (!monitor) return null;

  const handleTimeSlotClick = (day: string | undefined, time: string) => {
    if (!day) return;
    if (!selectedDate) return;
    if (selectedDiaAbbr && day !== selectedDiaAbbr) return;
    setSelectedSlot(`${day}-${time}`);
  };

  const handleAgendar = () => {
    if (!selectedSlot) return;
    if (!selectedDate) return;
    const [, horarioSelecionado] = selectedSlot.split("-");

    const dataFormatada = selectedDate.format("DD/MM/YYYY");

    const novoAgendamento: Agendamento = {
      id: Date.now().toString(),
      monitor: monitor,
      data: dataFormatada,
      hora: horarioSelecionado,
      status: "AGUARDANDO",
      valor: monitor.valor,
      statusPagamento: "PENDENTE",
      duracao: 1,
      link: "https://meet.google.com/zyw-jymr-ipg",
      aluno: usuarioId,
    };

    navigate("/MonitoriaJa/agendamento-monitor", {
      state: { agendamento: novoAgendamento },
    });
  };

  return (
    <div className="main">
      <div className="monitor-details-detalhes">
        <div className="dmonitor-profile">
          <div>
            <img
              src={monitor.foto}
              alt="imagem do monitor"
              className="monitorImage"
            />
          </div>
          <div className="avaliacao">
            <StarIcon sx={{ color: "gold" }} />
            <p className="nota">{notaMedia}</p>
            <p>{`(${totalAvaliacoes})`}</p>
          </div>
        </div>
        <div className="monitor-data">
          <div className="monitor-data-specific">
            <div className="monitor-nome">
              <h1>{monitor.nome}</h1>
              <VerifiedIcon sx={{ color: "green", width: 25, height: 25 }} />
            </div>

            <div className="monitor-atributos">
              <h2>
                {monitor.listaDisciplinas?.map(
                  (materia: string, index: number) => (
                    <span key={index} className="materia">
                      {materia}
                    </span>
                  )
                )}
              </h2>
              <div className="monitor-detalhes-atributos">
                <AttachMoneyIcon />
                <p>{monitor.valor}</p>
              </div>
              <div className="monitor-detalhes-atributos">
                <AccessTimeIcon />
                <p>{`${fixedLessons} lições`}</p>
              </div>
              <div className="monitor-detalhes-atributos">
                <EmojiEventsIcon />
                <p>{fixedConquista}</p>
              </div>
            </div>
          </div>
          <div className="monitor-status">
            <div className="status-online">
              <div className="online-dot"></div>
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="formação">
        <h1 className="titulo">Sobre o Monitor</h1>
        <p className="formação-paragrafo">
          {monitor.biografia || "Informação não disponível"}
        </p>
      </div>
      <div
        className="horários"
        style={
          {
            "--numero-de-colunas": horarios ? horarios.length : 0,
          } as React.CSSProperties
        }
      >
        <h1 className="titulo">Horários</h1>
        <div className="date-input">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
              <DatePicker
                label="Data de Agendamento"
                disablePast={true}
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={(newValue) => {
                  setSelectedDate(newValue);
                  setSelectedSlot(null); // limpa seleção ao mudar data
                }}
              />
            </Box>
          </LocalizationProvider>
        </div>
        <div className="outer-tabela">
          <div className="schedule-container">
            {horarios &&
              horarios.map(({ day, times }) => (
                <div key={day} className="day-column">
                  <div className="day-header">{day}</div>
                  {times!.map((time) => {
                    const slotId = `${day}-${time}`;
                    const isSelected = selectedSlot === slotId;
                    const isDisabled =
                      !!selectedDate && selectedDiaAbbr !== day;
                    return (
                      <div
                        key={time}
                        className={`time-slot ${
                          isSelected ? "selecionado" : ""
                        }`}
                        onClick={() => {
                          if (!isDisabled) handleTimeSlotClick(day, time);
                        }}
                        style={
                          isDisabled
                            ? { opacity: 0.5, pointerEvents: "none" }
                            : undefined
                        }
                      >
                        {time}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="botoes">
        <Button
          variant="outlined"
          sx={{ padding: "5px 40px" }}
          onClick={() => {
            navigate("/MonitoriaJa/lista-monitores");
          }}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          sx={{ padding: "5px 40px" }}
          onClick={handleAgendar}
          disabled={!selectedSlot || !selectedDate || !token}
        >
          Agendar
        </Button>
      </div>
      <ComentariosAvaliacao
        monitorId={String((monitor as any).id ?? (monitor as any)._id)}
      />
    </div>
  );
}

export default DetalhesMonitor;
