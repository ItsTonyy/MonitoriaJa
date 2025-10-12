import { combineReducers } from "@reduxjs/toolkit";
import monitorReducer from "./features/monitor/monitorSlice";
import agendamentoReducer from "./features/agendamento/agendamentoSlice";
import listaCartaoReducer from "./features/listaCartao/slice"; // <-- ajuste o caminho se necessário

const rootReducer = combineReducers({
  monitor: monitorReducer,
  agendamento: agendamentoReducer,
  cartoes: listaCartaoReducer, // <-- adiciona o slice de cartões
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
