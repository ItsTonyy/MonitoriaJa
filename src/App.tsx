import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RecuperarSenhaPage from "./pages/Login/recuperarSenha/RecuperarSenhaPage";
import AvaliacaoPosAulaPage from "./pages/Login/AvaliacaoPosAula/AvaliacaoPosAulaPage";
import ComentariosAvaliacaoPage from "./pages/Login/ComentariosAvaliacao/ComentariosAvaliacaoPage";
import ListaMonitores from "./components/ListaMonitores";
import ListaAgendamentos from "./components/ListaAgendamentos";
import CadastroMonitor from "./pages/CadastroMonitor";
import ResponsiveAppBar from "./components/login-form/AppBar";
import Footer from "./components/footer";
import DetalhesMonitor from "./components/detalhesMonitor/DetalhesMonitor";
import AgendamentoMonitor from "./components/detalhesMonitor/agendamentoMonitor";
import AppNavbar from "./components/appNavBar";
import DetalhesNotificao from "./components/DetalhesNotificao/DetalhesNotificao";

const App = () => {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        <Route path="/avaliacao-pos-aula" element={<AvaliacaoPosAulaPage />} />
        <Route
          path="/comentarios-avaliacao"
          element={<ComentariosAvaliacaoPage />}
        />
        <Route path="/lista-monitores" element={<ListaMonitores />} />
        <Route path="/lista-agendamentos" element={<ListaAgendamentos />} />
        <Route path="/cadastro-monitor" element={<CadastroMonitor />} />
        <Route path="/detalhes-monitor" element={<DetalhesMonitor />} />
        <Route path="/agendamento-monitor" element={<AgendamentoMonitor />} />
        <Route
          path="/detalhes-notificacao/:id"
          element={<DetalhesNotificao />}
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
