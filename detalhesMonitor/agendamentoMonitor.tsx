import React from 'react';
import './agendamentoMonitor.css';

interface AgendamentoMonitorProps {}

function AgendamentoMonitor(props: AgendamentoMonitorProps) {
  return (
    <main className="main">
      <h1 className="agendamento-titulo">Confira Seu Agendamento</h1>

      <div className="monitorDetails">
        <div className="monitorProfile">
          <div>
            <img
              src="../detalhesMonitor/public/usuario_desconhecido.png"
              alt="imagem do monitor"
              className="monitorImage"
            />
          </div>
        </div>
        <div className="monitor-data">
          <div className="monitor-data-specific">
            <h1 className="titulo-monitor">Monitor X</h1>
            <div className="monitor-materia-valor">
              <h2>Matéria X</h2>
            </div>
            <h2 className="duração">Duração XX a YY Min</h2>
          </div>
        </div>
      </div>

      <div className="agendamento">
        <div className="agendamento-details">
          <div className="agendamento-details-row-1">
            <div className="agendamento-details-attributes">
              <span className="material-symbols-outlined"> calendar_today </span>
              <p>XX/XX/XXXX</p>
            </div>

            <div className="agendamento-details-attributes">
              <img src="../detalhesMonitor/public/attach_money.png" alt="money icon" />
              <p>$XX,00</p>
            </div>
          </div>

          <div className="agendamento-details-row-2">
            <div className="agendamento-details-attributes">
              <span className="material-symbols-outlined"> alarm </span>
              <p>XX:XX</p>
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
          <input type="text" name="text" id="text" className="topicos-input" />
        </div>
      </div>

      <div className="botoes">
        <button className="botão">voltar</button>
        <button className="botão">agendar</button>
      </div>
    </main>
  );
}

export default AgendamentoMonitor;
