import { createSlice } from '@reduxjs/toolkit';
import { fetchUsuariosAdmin, removerUsuario, UsuarioCompleto } from './fetch';

interface AdminState {
  usuarios: UsuarioCompleto[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  usuarios: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUsuarios: (state) => {
      state.usuarios = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuariosAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuariosAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.usuarios = action.payload;
      })
      .addCase(fetchUsuariosAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || 'Erro ao buscar usuários';
      });
  },
});

export const { clearError, clearUsuarios } = adminSlice.actions;
export default adminSlice.reducer;