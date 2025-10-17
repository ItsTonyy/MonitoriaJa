import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import RecuperarSenhaPage from "./pages/Login/recuperarSenha/RecuperarSenhaPage";
import ResetPasswordPage from "./pages/Login/resetPassword/ResetPasswordPage";
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
import DisciplinaModal from "./components/disciplina/DisciplinaModal";
import MainLayout from "./components/MainLayout/MainLayout";
import LandingPage from "./components/landingPage";

const App = () => {
  return (
    <BrowserRouter>
      <AppNavBar />
      <MainLayout>
      <Routes>
        <Route path="/MonitoriaJa" element={<LandingPage />} />
            <Route path="/MonitoriaJa/login" element={<LoginPage />} />
        <Route
          path="/MonitoriaJa/recuperar-senha"
          element={<RecuperarSenhaPage />}
        />
         <Route path="/MonitoriaJa/redefinir-senha" element={<ResetPasswordPage />} />
        <Route
          path="/MonitoriaJa/avaliacao-pos-aula"
          element={<AvaliacaoPosAulaPage />}
        />
        <Route
          path="/MonitoriaJa/comentarios-avaliacao"
          element={<ComentariosAvaliacaoPage />}
        />
        <Route
          path="/MonitoriaJa/lista-monitores"
          element={<ListaMonitores />}
        />
        <Route
          path="/MonitoriaJa/lista-agendamentos"
          element={<ListaAgendamentos />}
        />
        <Route
          path="/MonitoriaJa/cadastro-monitor"
          element={<CadastroMonitor />}
        />
        <Route
          path="/MonitoriaJa/detalhes-monitor"
          element={<DetalhesMonitor />}
        />
        <Route
          path="/MonitoriaJa/agendamento-monitor"
          element={<AgendamentoMonitor />}
        />
        <Route
          path="/MonitoriaJa/detalhes-notificacao/:id"
          element={<DetalhesNotificao />}
        />
        <Route
          path="/MonitoriaJa/cadastro-disciplina"
          element={
            <DisciplinaModal
              open={true}
              onClose={() => window.history.back()}
              onSave={(disciplina) => {
                console.log("Disciplina:", disciplina);
                window.history.back();
              }}
            />
          }
        />
      </Routes>
      </MainLayout>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
