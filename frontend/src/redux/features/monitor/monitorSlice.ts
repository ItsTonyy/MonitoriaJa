import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Avaliacao } from "../../../models/avaliacao.model";
import { Disponibilidade } from "../../../models/disponibilidade.model";
import { Usuario } from "../../../models/usuario.model";

interface MonitorState {
  selectedMonitor: Usuario | null;
  monitorList: Usuario[];
  loading: boolean;
  error: string | null;
}

const initialState: MonitorState = {
  selectedMonitor: null,
  monitorList: [],
  loading: false,
  error: null,
};

const monitorSlice = createSlice({
  name: "monitor",
  initialState,
  reducers: {
    setSelectedMonitor: (state, action: PayloadAction<Usuario>) => {
      state.selectedMonitor = action.payload;
    },
    clearSelectedMonitor: (state) => {
      state.selectedMonitor = null;
    },
    setMonitorList: (state, action: PayloadAction<Usuario[]>) => {
      state.monitorList = action.payload;
    },
    updateMonitorAvaliacao: (
      state,
      action: PayloadAction<{ monitorId: string; avaliacao: Avaliacao }>
    ) => {
      const { monitorId, avaliacao } = action.payload;
      const monitor = state.monitorList.find((m) => m.id === monitorId);
      /*if (monitor) {
        monitor.listaAvaliacoes = [
          ...(monitor.listaAvaliacoes || []),
          avaliacao,
        ];
        // Recalcula média das avaliações
        const totalAvaliacoes = monitor.listaAvaliacoes.length;
        const somaAvaliacoes = monitor.listaAvaliacoes.reduce(
          (sum, av) => sum + (av.nota || 0),
          0
        );
        monitor.avaliacao =
          totalAvaliacoes > 0 ? somaAvaliacoes / totalAvaliacoes : 0;
      }*/
    },
    updateMonitorDisponibilidade: (
      state,
      action: PayloadAction<{
        monitorId: string;
        disponibilidade: Disponibilidade;
      }>
    ) => {
      const { monitorId, disponibilidade } = action.payload;
      const monitor = state.monitorList.find((m) => m.id === monitorId);
      /*if (monitor) {
        monitor.listaDisponibilidades = [
          ...(monitor.listaDisponibilidades || []),
          disponibilidade,
        ];
      }*/
    },
  },
});

export const {
  setSelectedMonitor,
  clearSelectedMonitor,
  setMonitorList,
  updateMonitorAvaliacao,
  updateMonitorDisponibilidade,
} = monitorSlice.actions;

export default monitorSlice.reducer;
