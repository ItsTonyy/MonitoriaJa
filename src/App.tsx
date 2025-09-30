import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RecuperarSenhaPage from "./pages/Login/recuperarSenha/RecuperarSenhaPage";
import AvaliacaoPosAulaPage from "./pages/Login/AvaliacaoPosAula/AvaliacaoPosAulaPage";
import ComentariosAvaliacaoPage from "./pages/Login/ComentariosAvaliacao/ComentariosAvaliacaoPage";
import ListaMonitores from "./components/ListaMonitores";
import ListaAgendamentos from "./components/ListaAgendamentos";
import CadastroMonitor from "./pages/CadastroMonitor";
import Footer from "./components/footer";
import DetalhesMonitor from "./components/detalhesMonitor/DetalhesMonitor";
import AgendamentoMonitor from "./components/detalhesMonitor/agendamentoMonitor";
import AppNavBar from "./components/appNavBar";
import DetalhesNotificao from "./components/DetalhesNotificao/DetalhesNotificao";
import ModalCancelamento from "./components/ModalCancelamento";

const App = () => {
  return (
      <BrowserRouter>
        <AppNavBar />
          <Routes>
            <Route path="/MonitoriaJa" element={<LoginPage />} />
            <Route path="/MonitoriaJa/recuperar-senha" element={<RecuperarSenhaPage />} />
            <Route path="/MonitoriaJa/avaliacao-pos-aula" element={<AvaliacaoPosAulaPage />} />
            <Route path="/MonitoriaJa/comentarios-avaliacao" element={<ComentariosAvaliacaoPage />} />
            <Route path="/MonitoriaJa/lista-monitores" element={<ListaMonitores />} />
            <Route path="/MonitoriaJa/lista-agendamentos" element={<ListaAgendamentos />} />
            <Route path="/MonitoriaJa/cadastro-monitor" element={<CadastroMonitor />} />
             <Route path="/MonitoriaJa/cancelamento" element={<ModalCancelamento open={true} onClose={() => {}} onConfirm={(motivo) => { console.log(motivo); }} />} />
            <Route path="/MonitoriaJa/detalhes-monitor" element={<DetalhesMonitor />} />
            <Route path="/MonitoriaJa/agendamento-monitor" element={<AgendamentoMonitor />} />
            <Route path="/MonitoriaJa/detalhes-notificacao/:id" element={<DetalhesNotificao />}/>
          </Routes>
        <Footer />
      </BrowserRouter>
  );
};

export default App;