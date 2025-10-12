import { useEffect, useState } from "react";
import "./detalhesMonitor.css";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearSelectedMonitor } from "../../redux/features/monitor/monitorSlice";
import { setCurrentAgendamento } from "../../redux/features/agendamento/agendamentoSlice";
import { Agendamento } from "../../models/agendamento.model";

interface TimeSlot {
  day: "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";
  times: string[];
}

function DetalhesMonitor() {
  const dispatch = useAppDispatch();
  const monitor = useAppSelector((state) => state.monitor.selectedMonitor);
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  // Horários mockados - idealmente viriam da disponibilidade do monitor
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
      navigate("/MonitoriaJa/lista-monitores");
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

  const handleAgendar = () => {
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR"); // formato: dd/mm/aaaa
    const horaFormatada = agora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }); // formato: hh:mm
    // Cria um novo agendamento com base no monitor selecionado
    const novoAgendamento: Agendamento = {
      monitor: monitor,
      data: dataFormatada,
      hora: horaFormatada,
      status: "AGUARDANDO",
      valor: monitor.valorHora,
      statusPagamento: "PENDENTE",
    };

    dispatch(setCurrentAgendamento(novoAgendamento));
    navigate("/MonitoriaJa/agendamento-monitor");
  };

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
              src="/public/five-stars-rating-icon-png.webp"
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
              <h2>R$ {monitor.valorHora}/hora</h2>
            </div>
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
    </div>
  );
}

export default DetalhesMonitor;
