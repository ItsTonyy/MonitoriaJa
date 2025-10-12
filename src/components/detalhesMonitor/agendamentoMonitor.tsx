import "./agendamentoMonitor.css";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamIcon from "@mui/icons-material/Videocam";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearAgendamento } from "../../redux/features/agendamento/agendamentoSlice";

interface AgendamentoMonitorProps {
  linkImagem?: string;
  nomeMonitor?: string;
  materias?: string[];
  data?: string; // xx/yy/zz
  horario?: string; // xx:00 - xx:00
  valor?: number; // x,00
  nota?: string; // x.0
}

function AgendamentoMonitor(props: AgendamentoMonitorProps) {
  const dispatch = useAppDispatch();
  const agendamento = useAppSelector((state) => state.agendamento);
  const navigate = useNavigate();
  /*const location = useLocation();
  const state = location.state || {};/*/
  let materiasTeste = ["matemática", "inglês", "português"];

  return (
    <main className="main">
      <h1 className="agendamento-titulo">Confira Seu Agendamento</h1>

      <div className="monitorDetails">
        <div className="monitorProfile">
          <div>
            <img
              src={agendamento.monitorImage}
              alt="imagem do monitor"
              className="monitorImage"
            />
          </div>

          <div className="avaliacao">
            <p className="nota">{props.nota}</p>
            <img
              src="./public/five-stars-rating-icon-png.webp"
              alt="avaliação do monitor"
              className="avaliação-monitor"
            />
          </div>
        </div>
        <div className="monitor-data">
          <div className="monitor-data-specific">
            <h1 className="titulo-monitor">{agendamento.monitorName}</h1>
            <div className="monitor-materia-valor">
              <h2>
                {props.materias?.map((materia, index) => (
                  <span key={index} className="materia">
                    {materia}
                  </span>
                ))}
              </h2>
            </div>
          </div>

          <div className="agendamento">
            <div className="agendamento-details">
              <div className="agendamento-details-row-1">
                <div className="agendamento-details-attributes">
                  <CalendarTodayIcon />
                  <p>{props.data}</p>
                </div>

                <div className="agendamento-details-attributes">
                  <AttachMoneyIcon />
                  <p>{props.valor}</p>
                </div>
              </div>

              <div className="agendamento-details-row-2">
                <div className="agendamento-details-attributes">
                  <AccessTimeIcon />
                  <p>{props.horario}</p>
                </div>

                <div className="agendamento-details-attributes">
                  <VideocamIcon />
                  <p>Teams</p>
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
            />
            <span className="checkbox-names">aula</span>
          </label>
          <label className="checkboxes-box" htmlFor="exercicio">
            <input
              type="checkbox"
              name="servico"
              id="exercicio"
              className="checkbox"
            />
            <span className="checkbox-names">exercício</span>
          </label>
        </div>
      </div>

      <div className="pagamento">
        <h1 className="titulo">Formas de Pagamento</h1>
        <div className="checkboxes">
          <label className="checkboxes-box" htmlFor="pix">
            <input type="radio" name="pagamento" id="pix" />
            <span className="checkbox-names">pix</span>
          </label>
          <label className="checkboxes-box" htmlFor="cartão">
            <input type="radio" name="pagamento" id="cartão" />
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
          />
        </div>
      </div>

      <div className="botoes">
        <Button
          variant="outlined"
          sx={{ padding: "5px 40px" }}
          onClick={() => {
            dispatch(clearAgendamento());
            navigate("/MonitoriaJa/detalhes-monitor");
          }}
        >
          Voltar
        </Button>
        <Button variant="contained" sx={{ padding: "5px 40px" }}>
          Agendar
        </Button>
      </div>
    </main>
  );
}

export default AgendamentoMonitor;
