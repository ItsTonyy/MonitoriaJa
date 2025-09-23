import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PerfilMonitorPage from "./pages/PerfilMonitor/PerfilMonitorPage";
import PerfilUsuarioPage from "./pages/PerfilUsuario/PerfilUsuarioPage"; 
import LoginPage from "./pages/Login/LoginPage";
import RecuperarSenhaPage from "./pages/Login/recuperarSenha/RecuperarSenhaPage";
import AvaliacaoPosAulaPage from "./pages/Login/AvaliacaoPosAula/AvaliacaoPosAulaPage";
import ComentariosAvaliacaoPage from "./pages/Login/ComentariosAvaliacao/ComentariosAvaliacaoPage";

const ListaAgendamentosPage: React.FC = () => <div>Lista de agendamentos (temporária)</div>;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />
        <Route path="/avaliacao-pos-aula" element={<AvaliacaoPosAulaPage />} />
        <Route path="/comentarios-avaliacao" element={<ComentariosAvaliacaoPage />} />
        <Route path="/perfil-monitor" element={<PerfilMonitorPage />} />
        <Route path="/perfil-usuario" element={<PerfilUsuarioPage />} /> {/* Nova rota adicionada */}
        <Route path="/lista-agendamentos" element={<ListaAgendamentosPage />} /> {/* rota temporária */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;