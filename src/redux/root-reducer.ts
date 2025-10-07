import { combineReducers } from "@reduxjs/toolkit";
import monitorReducer from "./features/monitor/monitorSlice";
import agendamentoReducer from "./features/agendamento/agendamentoSlice";

const rootReducer = combineReducers({
  monitor: monitorReducer,
  agendamento: agendamentoReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
