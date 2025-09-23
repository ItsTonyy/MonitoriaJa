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

const App = () => {
  return (
    <BrowserRouter>
      <ResponsiveAppBar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        <Route path="/avaliacao-pos-aula" element={<AvaliacaoPosAulaPage />} />
        <Route path="/comentarios-avaliacao" element={<ComentariosAvaliacaoPage />} />
        <Route path="/lista-monitores" element={<ListaMonitores />} />
        <Route path="/lista-agendamentos" element={<ListaAgendamentos />} />
        <Route path="/cadastro-monitor" element={<CadastroMonitor />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;