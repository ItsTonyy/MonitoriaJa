import { combineReducers } from "@reduxjs/toolkit";
import monitorReducer from "./features/monitor/monitorSlice";
import agendamentoReducer from "./features/agendamento/agendamentoSlice";
import listaCartaoReducer from "./features/listaCartao/slice"; // <-- ajuste o caminho se necessário
import loginReducer from "./features/login/slice";
import notificacoesReducer from "./features/notificacoes/slice";

const rootReducer = combineReducers({
  monitor: monitorReducer,
  agendamento: agendamentoReducer,
  cartoes: listaCartaoReducer, 
  login: loginReducer,
  notificacoes: notificacoesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;