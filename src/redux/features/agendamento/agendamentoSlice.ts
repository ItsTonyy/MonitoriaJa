import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AgendamentoState {
  monitorImage: string;
  monitorName: string;
  materia: string;
  valor: string;
  duracao: string;
  data?: string;
  horario?: string;
  selectedServices: string[];
  paymentMethod?: string;
  meetingTopics?: string;
}

const initialState: AgendamentoState = {
  monitorImage: "",
  monitorName: "",
  materia: "",
  valor: "",
  duracao: "",
  selectedServices: [],
};

const agendamentoSlice = createSlice({
  name: "agendamento",
  initialState,
  reducers: {
    setAgendamentoData: (
      state,
      action: PayloadAction<Partial<AgendamentoState>>
    ) => {
      return { ...state, ...action.payload };
    },
    clearAgendamento: () => initialState,
  },
});

export const { setAgendamentoData, clearAgendamento } =
  agendamentoSlice.actions;
export default agendamentoSlice.reducer;