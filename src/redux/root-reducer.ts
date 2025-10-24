import { combineReducers } from "@reduxjs/toolkit";
import monitorReducer from "./features/monitor/monitorSlice";
import agendamentoReducer from "./features/agendamento/agendamentoSlice";
import listaCartaoReducer from "./features/listaCartao/slice"; // <-- ajuste o caminho se necessário
import loginReducer from "./features/login/slice";
import notificacoesReducer from "./features/notificacoes/slice";
import usuarioReducer from "./features/perfilUsuario/slice";
import perfilMonitorReducer from "./features/perfilMonitor/slice";
import alterarSenhaReducer from "./features/alterarSenha/slice";
import avaliacaoReducer from "./features/avaliacao/slice";
import adminReducer from "./features/admin/slice";

const rootReducer = combineReducers({
  monitor: monitorReducer,
  agendamento: agendamentoReducer,
  cartoes: listaCartaoReducer,
  login: loginReducer,
  notificacoes: notificacoesReducer,
  usuario: usuarioReducer,
  perfilMonitor: perfilMonitorReducer,
  alterarSenha: alterarSenhaReducer,
  avaliacao: avaliacaoReducer,
  admin: adminReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
