import { useState } from 'react';
import './detalhesMonitor.css';
import usuarioImg from '/usuario_desconhecido.png';
import ratingImg from '/five-stars-rating-icon-png.webp';
import Button from '@mui/material/Button';

function DetalhesMonitor() {
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

  const scheduleData = [
    { day: 'seg', times: ['09:00', '11:00', '19:30'] },
    { day: 'ter', times: ['10:00', '15:00'] },
    { day: 'qua', times: ['08:00', '20:00'] },
    { day: 'qui', times: ['12:30', '14:30', '20:00'] },
    { day: 'sex', times: ['08:30', '12:00', '17:00'] },
    { day: 'sab', times: ['13:00', '17:00'] },
    { day: 'dom', times: ['13:00', '17:00'] },
  ];
  return (
    <div className="main">
      <div className="monitor-details">
        <div className="monitor-profile">
          <div>
            <img src={usuarioImg} alt="imagem do monitor" className="monitorImage" />
          </div>
          <div className="avaliacao">
            <p className="nota">5.0</p>
            <img src={ratingImg} alt="avaliação do monitor" className="avaliação-monitor" />
          </div>
        </div>
        <div className="monitor-data">
          <div className="monitor-data-specific">
            <h1>Monitor X</h1>
            <div className="monitor-materia-valor">
              <h2>Matéria X</h2>
              <p className="traço">-</p>
              <h2>R$XX,00</h2>
            </div>
            <h2 className="duração">Duração XX a YY Min</h2>
          </div>
        </div>
      </div>

      <div className="formação">
        <h1 className="titulo">Formação e Cursos</h1>
        <hr />
        <p className="formação-paragrafo">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean varius tempor tortor, eu
          ultricies nulla tempor eget. Vestibulum nec pharetra lectus. Etiam finibus, mi a bibendum
          tempus, lectus nisl tincidunt arcu, a tincidunt tortor risus sit amet ipsum. Mauris vel
          massa justo. Vestibulum ac eros ipsum.
        </p>
      </div>

      <div className="horários">
        <h1 className="titulo">Horários</h1>
        <hr />
        <div className="outer-tabela">
          <div className="schedule-container">
            {scheduleData.map(({ day, times }) => (
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
        <Button variant="outlined" sx={{ padding: '5px 40px' }}>
          Voltar
        </Button>
        <Button variant="contained" sx={{ padding: '5px 40px' }}>
          Agendar
        </Button>
      </div>
    </div>
  );
}

export default DetalhesMonitor;
