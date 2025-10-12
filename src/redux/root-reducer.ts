import { combineReducers } from "@reduxjs/toolkit";
import monitorReducer from "./features/monitor/monitorSlice";
import agendamentoReducer from "./features/agendamento/agendamentoSlice";
import loginReducer from "./features/login/slice";
import notificacoesReducer from "./features/notificacoes/slice";
import avaliacaoReducer from "./features/avaliacao/slice";

const rootReducer = combineReducers({
  monitor: monitorReducer,
  agendamento: agendamentoReducer,
  login: loginReducer,
  notificacoes: notificacoesReducer,
  avaliacao: avaliacaoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
