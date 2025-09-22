import { useState } from 'react';
import './detalhesMonitor.css';
import usuarioImg from '/usuario_desconhecido.png';
import ratingImg from '/five-stars-rating-icon-png.webp';
import Button from '@mui/material/Button';

interface TimeSlot {
  day: 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom';
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
  const [selectedSlots, setSelectedSlots] = useState<Set<string>>(new Set());

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
      <div className="monitor-details">
        <div className="monitor-profile">
          <div>
            <img src={props.monitorImage} alt="imagem do monitor" className="monitorImage" />
          </div>
          <div className="avaliacao">
            <p className="nota">5.0</p>
            <img src={ratingImg} alt="avaliação do monitor" className="avaliação-monitor" />
          </div>
        </div>
        <div className="monitor-data">
          <div className="monitor-data-specific">
            <h1>{props.monitorName}</h1>
            <div className="monitor-materia-valor">
              <h2>{props.materia}</h2>
              <p className="traço">-</p>
              <h2>{props.valor}</h2>
            </div>
            <h2 className="duração">{props.duracao}</h2>
          </div>
        </div>
      </div>

      <div className="formação">
        <h1 className="titulo">Formação e Cursos</h1>
        <hr />
        <p className="formação-paragrafo">{props.formacao}</p>
      </div>

      <div
        className="horários"
        style={{ '--numero-de-colunas': numeroColunasHorarios } as React.CSSProperties}
      >
        <h1 className="titulo">Horários</h1>
        <hr />
        <div className="outer-tabela">
          <div className="schedule-container">
            {props.horarios &&
              props.horarios.map(({ day, times }) => (
                <div key={day} className="day-column">
                  <div className="day-header">{day}</div>
                  {times.map((time) => {
                    const slotId = `${day}-${time}`;
                    const isSelected = selectedSlots.has(slotId);
                    return (
                      <div
                        key={time}
                        className={`time-slot ${isSelected ? 'selecionado' : ''}`}
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
        <Button variant="outlined" sx={{ padding: '5px 40px' }} onClick={props.onVoltar}>
          Voltar
        </Button>
        <Button variant="contained" sx={{ padding: '5px 40px' }} onClick={props.onAgendar}>
          Agendar
        </Button>
      </div>
    </div>
  );
}

export default DetalhesMonitor;
