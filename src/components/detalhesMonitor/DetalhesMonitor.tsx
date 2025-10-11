import { useEffect, useState } from "react";
import "./detalhesMonitor.css";
import Button from "@mui/material/Button";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearSelectedMonitor } from "../../redux/features/monitor/monitorSlice";
import { setAgendamentoData } from "../../redux/features/agendamento/agendamentoSlice";

interface TimeSlot {
  day: "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
  times: string[];
}

interface DetalhesMonitorProps {
  monitorImage?: string;
  monitorName?: string;
  materia?: string;
  valor?: string;
  duracao?: string;
  formacao?: string;
  horarios?: TimeSlot[];
  onVoltar?: () => void;
  onAgendar?: () => void;
}

function DetalhesMonitor(props: DetalhesMonitorProps) {
  const dispatch = useAppDispatch();
  const monitor = useAppSelector((state) => state.monitor.selectedMonitor);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  /*const monitor = location.state?.monitor;
  const monitorImage = monitor?.foto || props.monitorImage;
  const monitorName = monitor?.nome || props.monitorName;
  const materia = monitor?.materia || props.materia;
  const valor = monitor?.valor || props.valor;
  const duracao = monitor?.duracao || props.duracao;
  const formacao = monitor?.formacao || props.formacao;*/
  const horarios = [
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
      navigate("/MonitoriaJa/");
    }
  }, [monitor, navigate]);

  if (!monitor) return null;
  const handleTimeSlotClick = (day: string, time: string) => {
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

  const numeroColunasHorarios = props.horarios ? props.horarios.length : 0;
  console.log(numeroColunasHorarios);

  return (
    <div className="main">
      <div className="monitor-details-detalhes">
        <div className="monitor-profile">
          <div>
            <img
              src={monitor.foto}
              alt="imagem do monitor"
              className="monitorImage"
            />
          </div>
          <div className="avaliacao">
            <p className="nota">{monitor.avaliacao}</p>
            <img
              src="./public/five-stars-rating-icon-png.webp"
              alt="avaliação do monitor"
              className="avaliação-monitor"
            />
          </div>
        </div>
        <div className="monitor-data">
          <div className="monitor-data-specific">
            <h1>{monitor.nome}</h1>
            <div className="monitor-materia-valor">
              <h2>{monitor.materia}</h2>
              <p className="traço">-</p>
              <h2>{monitor.valor}</h2>
            </div>
            <h2 className="duração">duracao</h2>
          </div>
        </div>
      </div>

      <div className="formação">
        <h1 className="titulo">Formação e Cursos</h1>
        <p className="formação-paragrafo">{monitor.formacao}</p>
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
                  {times.map((time) => {
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
            navigate("/MonitoriaJa/");
          }}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          sx={{ padding: "5px 40px" }}
          onClick={() => {
            dispatch(
              setAgendamentoData({
                monitorImage: monitor.foto,
                monitorName: monitor.nome,
                materia: monitor.materia,
                valor: monitor.valor,
                duracao: "1h", 
              })
            );
            navigate("/MonitoriaJa/agendamento-monitor");
          }}
        >
          Agendar
        </Button>
      </div>
    </div>
  );
}

export default DetalhesMonitor;
