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
import Middleware from "./components/routesMiddleware";
import ListagemUsuarios from "./components/ListagemUsuarios/listagemUsuarios";
import HistoricoAgendamentos from "./components/HistoricoAgendamentos"

const App = () => {
  return (
    <BrowserRouter>
      <AppNavBar />
      <MainLayout>
        <Routes>
          <Route path="/MonitoriaJa/historico-agendamento" element={< HistoricoAgendamentos/>} />
          <Route path="/MonitoriaJa/alterar-senha/:userId" element={<AlterarSenhaPage />} />
          <Route path="/MonitoriaJa/perfil-usuario/:userId" element={<PerfilUsuarioPage />} />
          <Route path="/MonitoriaJa/perfil-monitor/:monitorId" element={<PerfilMonitorPage />} />
          <Route path="/MonitoriaJa" element={<LandingPage />} />
          <Route path="/MonitoriaJa/login" element={<LoginPage />} />
          <Route
            path="/MonitoriaJa/recuperar-senha"
            element={<RecuperarSenhaPage />}
          />
          <Route
            path="/MonitoriaJa/redefinir-senha"
            element={<ResetPasswordPage />}
          />

          <Route
            path="/MonitoriaJa/avaliacao-pos-aula"
            element={
              <Middleware>
                <AvaliacaoPosAulaPage />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/comentarios-avaliacao"
            element={
              <Middleware>
                <ComentariosAvaliacaoPage />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/lista-monitores"
            element={
              //<Middleware>
                <ListaMonitores />
              //</Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/lista-agendamentos"
            element={
              <Middleware>
                <ListaAgendamentos />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/cadastro-monitor"
            element={<CadastroMonitor />}
          />
          <Route
            path="/MonitoriaJa/detalhes-monitor"
            element={
              //<Middleware>
                <DetalhesMonitor />
              //</Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/agendamento-monitor"
            element={
              <Middleware>
                <AgendamentoMonitor />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/detalhes-notificacao/:id"
            element={
              <Middleware>
                <DetalhesNotificao />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/cadastro-disciplina"
            element={
              <Middleware>
                <DisciplinaModal
                  open={true}
                  onClose={() => window.history.back()}
                  onSave={(disciplina) => {
                    console.log("Disciplina:", disciplina);
                    window.history.back();
                  }}
                />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/perfil-monitor"
            element={
              <Middleware>
                <PerfilMonitorPage />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/perfil-usuario"
            element={
              <Middleware>
                <PerfilUsuarioPage />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/alterar-senha"
            element={
              <Middleware>
                <AlterarSenhaPage />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/pix"
            element={
              <Middleware>
                <PixPage />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/cadastra-cartao"
            element={
              <Middleware>
                <CadastraCartao />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/confirma-pagamento"
            element={
              <Middleware>
                <ConfirmaPagamento />
              </Middleware>
            }
          />
          <Route
            path="/MonitoriaJa/lista-cartao"
            element={
              <Middleware>
                <ListaCartaoPage />
              </Middleware>
            }
          />
          <Route path="/MonitoriaJa/listar-usuarios" element={
            <Middleware> <ListagemUsuarios/></Middleware>
          }
          />
        </Routes>
      </MainLayout>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
