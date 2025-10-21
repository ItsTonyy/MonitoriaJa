import { useEffect, useState } from "react";
import "./detalhesMonitor.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearSelectedMonitor } from "../../redux/features/monitor/monitorSlice";
import { setCurrentAgendamento } from "../../redux/features/agendamento/agendamentoSlice";
import ComentariosAvaliacao from "../comentariosAvaliacao/ComentariosAvaliacao";
import StarIcon from "@mui/icons-material/Star";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Agendamento } from "../../models/agendamento.model";

/*interface TimeSlot {
  day: "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
  times: string[];
}*/

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
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
  const dispatch = useAppDispatch();
  const monitor = useAppSelector((state) => state.monitor.selectedMonitor);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const usuarioLogado = useAppSelector((state) => state.login.user);

  // Horários do monitor - idealmente viriam da disponibilidade do monitor no Redux
  const horarios = monitor?.listaDisponibilidades || [
    { day: "seg", times: ["10:00", "14:00", "16:00", "22:00"] },
    { day: "ter", times: ["10:00", "14:00", "16:00"] },
    { day: "qua", times: ["10:00", "14:00", "16:00", "20:00"] },
    { day: "qui", times: ["10:00", "14:00", "16:00", "20:00"] },
    { day: "sex", times: ["7:00", "10:00", "20:00"] },
    { day: "sab", times: ["10:00"] },
    { day: "dom", times: ["16:00", "20:00"] },
  ];

  useEffect(() => {
    if (!monitor) {
      navigate("/MonitoriaJa/lista-monitores");
    }
  }, [monitor, navigate]);

  if (!monitor) return null;

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

  const handleAgendar = () => {
    console.log("usuarioLogado:", usuarioLogado);
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR"); // formato: dd/mm/aaaa
    const horaFormatada = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }); // formato: hh:mm
    // Cria um novo agendamento com base no monitor selecionado
    const novoAgendamento: Agendamento = {
      id: Date.now().toString(), // Gera um id único baseado no timestamp
      monitor: monitor,
      data: dataFormatada,
      hora: horaFormatada,
      status: "AGUARDANDO",
      valor: monitor.valor,
      statusPagamento: "PENDENTE",
      alunoId: usuarioLogado?.id,
    };

    dispatch(setCurrentAgendamento(novoAgendamento));
    navigate("/MonitoriaJa/agendamento-monitor");
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
            <p className="nota">{monitor.avaliacao}</p>
            <p>{`(${getRandomInt(50, 10000)})`}</p>
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
                {monitor.listaDisciplinas?.map((materia, index) => (
                  <span key={index} className="materia">
                    {materia}
                  </span>
                ))}
              </h2>
              <div className="monitor-detalhes-atributos">
                <AttachMoneyIcon />
                <p>{monitor.valor}</p>
              </div>
              <div className="monitor-detalhes-atributos">
                <AccessTimeIcon />
                <p>{`${getRandomInt(10, 100)} lições`}</p>
              </div>
              <div className="monitor-detalhes-atributos">
                <EmojiEventsIcon />
                <p>{conquistas[getRandomInt(0, conquistas.length)]}</p>
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
        <h1 className="titulo">Sobre o Monitor e Suas Formações</h1>
        <p className="formação-paragrafo">
          {monitor.formacao || "Informação não disponível"}
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
        <div className="outer-tabela">
          <div className="schedule-container">
            {horarios &&
              horarios.map(({ day, times }) => (
                <div key={day} className="day-column">
                  <div className="day-header">{day}</div>
                  {times!.map((time) => {
                    const slotId = `${day}-${time}`;
                    const isSelected = selectedSlots.has(slotId);
                    return (
                      <div
                        key={time}
                        className={`time-slot ${
                          isSelected ? "selecionado" : ""
                        }`}
                        onClick={() => handleTimeSlotClick(day, time)}
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
            dispatch(clearSelectedMonitor());
            navigate("/MonitoriaJa/lista-monitores");
          }}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          sx={{ padding: "5px 40px" }}
          onClick={handleAgendar}
          disabled={selectedSlots.size === 0}
        >
          Agendar
        </Button>
      </div>
      <ComentariosAvaliacao />
    </div>
  );
}

export default DetalhesMonitor;
