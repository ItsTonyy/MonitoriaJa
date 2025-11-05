import { createSlice } from '@reduxjs/toolkit';
import { fetchUsuariosAdmin, UsuarioCompleto } from './fetch';

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
  reducers: {},
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
        state.error = action.error.message || 'Erro ao buscar usuários';
      });
  },
});

export default adminSlice.reducer;
