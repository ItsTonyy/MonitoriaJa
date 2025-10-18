import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Agendamento } from "../../../models/agendamento.model";

interface AgendamentoState {
  currentAgendamento: Agendamento | null;
  agendamentosList: Agendamento[];
  loading: boolean;
  error: string | null;
}

const initialState: AgendamentoState = {
  currentAgendamento: null,
  agendamentosList: [],
  loading: false,
  error: null,
};

const agendamentoSlice = createSlice({
  name: "agendamento",
  initialState,
  reducers: {
    setCurrentAgendamento: (state, action: PayloadAction<Agendamento>) => {
      state.currentAgendamento = action.payload;
    },
    clearCurrentAgendamento: (state) => {
      state.currentAgendamento = null;
    },
    addAgendamento: (state, action: PayloadAction<Agendamento>) => {
      state.agendamentosList.push(action.payload);
    },
    updateAgendamentoStatus: (
      state,
      action: PayloadAction<{
        agendamentoId: number;
        status:
          | "AGUARDANDO"
          | "CONFIRMADO"
          | "CANCELADO"
          | "REMARCADO"
          | "CONCLUIDO";
        motivoCancelamento?: string;
        novaData?: string; // Adicionado
        novoHorario?: string; // Adicionado
      }>
    ) => {
      const agendamento = state.agendamentosList.find(
        (a) => a.id === action.payload.agendamentoId
      );
      if (agendamento) {
        agendamento.status = action.payload.status;

        // Se for cancelamento
        if (action.payload.motivoCancelamento) {
          agendamento.motivoCancelamento = action.payload.motivoCancelamento;
        }

        // Se for remarcação
        if (
          action.payload.status === "REMARCADO" &&
          action.payload.novaData &&
          action.payload.novoHorario
        ) {
          agendamento.data = action.payload.novaData;
          agendamento.hora = action.payload.novoHorario;
        }
      }
    },
    updateAgendamentoPagamento: (
      state,
      action: PayloadAction<{
        agendamentoId: number;
        statusPagamento: "PENDENTE" | "PAGO" | "REEMBOLSADO";
        formaPagamento?: "CARTAO" | "PIX";
      }>
    ) => {
      const agendamento = state.agendamentosList.find(
        (a) => a.id === action.payload.agendamentoId
      );
      if (agendamento) {
        agendamento.statusPagamento = action.payload.statusPagamento;
        if (action.payload.formaPagamento) {
          agendamento.formaPagamento = action.payload.formaPagamento;
        }
      }
    },
    setAgendamentosList: (state, action: PayloadAction<Agendamento[]>) => {
      state.agendamentosList = action.payload;
    },
  },
});

export const {
  setCurrentAgendamento,
  clearCurrentAgendamento,
  addAgendamento,
  updateAgendamentoStatus,
  updateAgendamentoPagamento,
  setAgendamentosList,
} = agendamentoSlice.actions;

export default agendamentoSlice.reducer;
