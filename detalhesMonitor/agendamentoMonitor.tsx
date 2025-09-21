import React from 'react';
import './agendamentoMonitor.css';
import Button from '@mui/material/Button';

interface AgendamentoMonitorProps {
  linkImagem?: string;
  nomeMonitor?: string;
  materias?: string[];
  duracao?: string;
  data?: string;
  horario?: string;
  valor?: number;
}

function AgendamentoMonitor(props: AgendamentoMonitorProps) {
  return (
    <div className="agendamento-wrapper">
      <main className="main">
        <h1 className="agendamento-titulo">Confira Seu Agendamento</h1>

        <div className="monitorDetails">
          <div className="monitorProfile">
            <div>
              <img src={props.linkImagem} alt="imagem do monitor" className="monitorImage" />
            </div>
          </div>
          <div className="monitor-data">
            <div className="monitor-data-specific">
              <h1 className="titulo-monitor">{props.nomeMonitor}</h1>
              <div className="monitor-materia-valor">
                <h2>{props.materias}</h2>
              </div>
              <h2 className="duração">{props.duracao}</h2>
            </div>
          </div>
        </div>

        <div className="agendamento">
          <div className="agendamento-details">
            <div className="agendamento-details-row-1">
              <div className="agendamento-details-attributes">
                <span className="material-symbols-outlined"> calendar_today </span>
                <p>{props.data}</p>
              </div>

              <div className="agendamento-details-attributes">
                <img src="../detalhesMonitor/public/attach_money.png" alt="money icon" />
                <p>{`$ ${props.valor}`}</p>
              </div>
            </div>

            <div className="agendamento-details-row-2">
              <div className="agendamento-details-attributes">
                <span className="material-symbols-outlined"> alarm </span>
                <p>{props.horario}</p>
              </div>

              <div className="agendamento-details-attributes">
                <span className="material-symbols-outlined"> video_call </span>
                <p>Videoconferência</p>
              </div>
            </div>
          </div>
        </div>

        <div className="servicos">
          <h1 className="titulo">Tipo de Serviço</h1>
          <hr />
          <div className="checkboxes">
            <div className="checkboxes-box">
              <input type="checkbox" name="servico" id="aula" className="checkbox" />
              <label htmlFor="aula" className="checkbox-names">
                aula
              </label>
            </div>
            <div className="checkboxes-box">
              <input type="checkbox" name="servico" id="exercicio" className="checkbox" />
              <label htmlFor="exercicio" className="checkbox-names">
                exercício
              </label>
            </div>
          </div>
        </div>

        <div className="pagamento">
          <h1 className="titulo">Formas de Pagamento</h1>
          <hr />
          <div className="checkboxes">
            <div className="checkboxes-box">
              <input type="radio" name="pagamento" id="pix" className="checkbox" checked />
              <label htmlFor="pix">pix</label>
            </div>
            <div className="checkboxes-box">
              <input type="radio" name="pagamento" id="cartão" className="checkbox" />
              <label htmlFor="cartão">cartão</label>
            </div>
          </div>
        </div>

        <div className="formação">
          <h1 className="titulo">Tópicos da Reunião</h1>
          <hr />
          <div className="text-box">
            <textarea name="text" id="text" maxLength={1500} className="topicos-input" />
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
      </main>
    </div>
  );
}

export default AgendamentoMonitor;
