import "./agendamentoMonitor.css";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamIcon from "@mui/icons-material/Videocam";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { agendamentoService } from "../../services/agendamentoService";
import { useState } from "react";

function AgendamentoMonitor() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentAgendamento = (location.state as any)?.agendamento;
  const [servicoSelecionado, setServicoSelecionado] = useState<string[]>([]);
  const [formaPagamento, setFormaPagamento] = useState<"CARTAO" | "PIX" | "">(
    ""
  );
  const [topicos, setTopicos] = useState("");

  // Redirect if no agendamento is selected
  if (!currentAgendamento) {
    navigate("/MonitoriaJa/");
    return null;
  }

  const handleServicoChange = (servico: string) => {
    setServicoSelecionado((prev) => {
      if (prev.includes(servico)) {
        return prev.filter((s) => s !== servico);
      }
      return [...prev, servico];
    });
  };

  const handleAgendar = async () => {
    if (!formaPagamento) return;

    try {
      await agendamentoService.create({
        monitor: currentAgendamento.monitor,
        data: currentAgendamento.data,
        hora: currentAgendamento.hora,
        valor: currentAgendamento.valor,
        statusPagamento: "PENDENTE",
        formaPagamento,
        status: "AGUARDANDO",
        servico:
          servicoSelecionado.length === 2
            ? "Aula"
            : servicoSelecionado.includes("aula")
            ? "Aula"
            : "Exercícios",
        topicos,
      });

      if (formaPagamento === "PIX") {
        navigate("/MonitoriaJa/pix");
      } else if (formaPagamento === "CARTAO") {
        navigate("/MonitoriaJa/lista-cartao");
      } else {
        navigate("/MonitoriaJa/lista-agendamentos");
      }
    } catch (e) {
      alert("Erro ao atualizar agendamento");
    }
  };

  return (
    <main className="main">
      <h1 className="agendamento-titulo">Confira Seu Agendamento</h1>

      <div className="monitorDetails">
        <div className="monitorProfile">
          <div>
            <h1 className="titulo-monitor-agendamento">
              {currentAgendamento.monitor?.nome}
            </h1>
            <img
              src={currentAgendamento.monitor?.foto}
              alt="imagem do monitor"
              className="monitorImage"
            />
          </div>
        </div>
        <div className="monitor-data">
          <div className="agendamento">
            <div className="agendamento-details">
              <div className="agendamento-details-row-1">
                <div className="agendamento-details-attributes">
                  <CalendarTodayIcon />
                  <p>{currentAgendamento.data}</p>
                </div>

                <div className="agendamento-details-attributes">
                  <AttachMoneyIcon />
                  <p>{currentAgendamento.valor}</p>
                </div>
              </div>

              <div className="agendamento-details-row-2">
                <div className="agendamento-details-attributes">
                  <AccessTimeIcon />
                  <p>{currentAgendamento.hora}</p>
                </div>

                <div className="agendamento-details-attributes">
                  <VideocamIcon />
                  <p>Google Meet</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="servicos">
        <h1 className="titulo">Tipo de Serviço</h1>
        <div className="checkboxes">
          <label className="checkboxes-box" htmlFor="aula">
            <input
              type="checkbox"
              name="servico"
              id="aula"
              className="checkbox"
              checked={servicoSelecionado.includes("aula")}
              onChange={() => handleServicoChange("aula")}
            />
            <span className="checkbox-names">aula</span>
          </label>
          <label className="checkboxes-box" htmlFor="exercicio">
            <input
              type="checkbox"
              name="servico"
              id="exercicio"
              className="checkbox"
              checked={servicoSelecionado.includes("exercicio")}
              onChange={() => handleServicoChange("exercicio")}
            />
            <span className="checkbox-names">exercício</span>
          </label>
        </div>
      </div>

      <div className="pagamento">
        <h1 className="titulo">Formas de Pagamento</h1>
        <div className="checkboxes">
          <label className="checkboxes-box" htmlFor="pix">
            <input
              type="radio"
              name="pagamento"
              id="pix"
              checked={formaPagamento === "PIX"}
              onChange={() => setFormaPagamento("PIX")}
            />
            <span className="checkbox-names">pix</span>
          </label>
          <label className="checkboxes-box" htmlFor="cartão">
            <input
              type="radio"
              name="pagamento"
              id="cartão"
              checked={formaPagamento === "CARTAO"}
              onChange={() => setFormaPagamento("CARTAO")}
            />
            <span className="checkbox-names">cartão</span>
          </label>
        </div>
      </div>

      <div className="formação">
        <h1 className="titulo">Tópicos da Reunião</h1>
        <div className="text-box">
          <textarea
            name="text"
            id="text"
            maxLength={1500}
            className="topicos-input"
            value={topicos}
            onChange={(e) => setTopicos(e.target.value)}
          />
        </div>
      </div>

      <div className="botoes">
        <Button
          variant="outlined"
          sx={{ padding: "5px 40px" }}
          onClick={() => navigate("/MonitoriaJa/detalhes-monitor")}
        >
          Voltar
        </Button>
        <Button
          variant="contained"
          sx={{ padding: "5px 40px" }}
          onClick={handleAgendar}
          disabled={!formaPagamento || servicoSelecionado.length === 0}
        >
          Agendar
        </Button>
      </div>
    </main>
  );
}

export default AgendamentoMonitor;