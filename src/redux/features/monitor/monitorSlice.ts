import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Monitor } from "../../../components/ListaMonitores";

interface MonitorState {
  selectedMonitor: Monitor | null;
  monitorList: Monitor[];
}

const initialState: MonitorState = {
  selectedMonitor: null,
  monitorList: [], // Você pode inicializar com MONITORES se quiser
};

const monitorSlice = createSlice({
  name: "monitor",
  initialState,
  reducers: {
    setSelectedMonitor: (state, action: PayloadAction<Monitor>) => {
      state.selectedMonitor = action.payload;
    },
    clearSelectedMonitor: (state) => {
      state.selectedMonitor = null;
    },
  },
});

export const { setSelectedMonitor, clearSelectedMonitor } =
  monitorSlice.actions;
export default monitorSlice.reducer;