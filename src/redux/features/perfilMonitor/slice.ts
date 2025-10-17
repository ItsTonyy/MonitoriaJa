import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MonitorState {
  nome: string;
  materias: string[];
  telefone: string;
  email: string;
  descricao: string;
}

const initialState: MonitorState = {
  nome: 'Monitor X',
  materias: ['Matéria X'],
  telefone: '',
  email: '',
  descricao: '',
};

const monitorSlice = createSlice({
  name: 'monitor',
  initialState,
  reducers: {
    atualizarDescricao: (state, action: PayloadAction<string>) => {
      state.descricao = action.payload;
    },
    atualizarContato: (state, action: PayloadAction<{ telefone: string; email: string }>) => {
      state.telefone = action.payload.telefone;
      state.email = action.payload.email;
    },
    atualizarMaterias: (state, action: PayloadAction<string[]>) => {
      state.materias = action.payload;
    },
  },
});

export const { atualizarDescricao, atualizarContato, atualizarMaterias } = monitorSlice.actions;
export default monitorSlice.reducer;
