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
import PerfilMonitorPage from "./pages/PerfilMonitor/PerfilMonitorPage";
import PerfilUsuarioPage from "./pages/PerfilUsuario/PerfilUsuarioPage";
import AlterarSenhaPage from "./pages/AlterarSenha/AlterarSenhaPage";
import PixPage from "./pages/Pagamento/Pix/PixPage";
import CadastraCartao from "./pages/Pagamento/Cartao/CadastraCartao/CadastraCartaoPage";
import ConfirmaPagamento from "./pages/Pagamento/Cartao/ConfirmaPagamento/ConfirmaPagamentoPage";
import ListaCartaoPage from "./pages/Pagamento/Cartao/ListaCartao/ListaCartaoPage";

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
        <Route 
          path="/MonitoriaJa/perfil-monitor" 
          element={<PerfilMonitorPage/>}/>
        <Route 
          path="/MonitoriaJa/perfil-usuario" 
          element={<PerfilUsuarioPage/>}/>
        <Route 
          path="/MonitoriaJa/alterar-senha" 
          element={<AlterarSenhaPage/>}/>
        <Route 
          path="/MonitoriaJa/pix" 
          element={<PixPage/>}/>
        <Route 
          path="/MonitoriaJa/cadastra-cartao" 
          element={<CadastraCartao/>}/>
        <Route 
          path="/MonitoriaJa/confirma-pagamento" 
          element={<ConfirmaPagamento/>}/>
        <Route 
          path="/MonitoriaJa/lista-cartao" 
          element={<ListaCartaoPage/>}/>
      </Routes>
      </MainLayout>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
