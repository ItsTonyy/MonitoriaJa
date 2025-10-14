// features/alterarSenha/slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface AlterarSenhaState {
  senhaAnterior: string;
  novaSenha: string;
  confirmarSenha: string;
  errors: { nova?: string; confirmar?: string };
  status: 'idle' | 'loading' | 'success' | 'error';
}

const initialState: AlterarSenhaState = {
  senhaAnterior: '',
  novaSenha: '',
  confirmarSenha: '',
  errors: {},
  status: 'idle',
};

// AsyncThunk simulando atualização da senha
export const atualizarSenha = createAsyncThunk(
  'alterarSenha/atualizarSenha',
  async (senha: { senhaAnterior: string; novaSenha: string }) => {
    // Aqui poderíamos chamar o backend, mas por enquanto simulamos delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return senha.novaSenha;
  }
);

const alterarSenhaSlice = createSlice({
  name: 'alterarSenha',
  initialState,
  reducers: {
    setSenhaAnterior: (state, action: PayloadAction<string>) => {
      state.senhaAnterior = action.payload;
    },
    setNovaSenha: (state, action: PayloadAction<string>) => {
      state.novaSenha = action.payload;
    },
    setConfirmarSenha: (state, action: PayloadAction<string>) => {
      state.confirmarSenha = action.payload;
    },
    setErrors: (state, action: PayloadAction<{ nova?: string; confirmar?: string }>) => {
      state.errors = action.payload;
    },
    resetStatus: (state) => {
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(atualizarSenha.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(atualizarSenha.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'success';
        state.novaSenha = '';
        state.confirmarSenha = '';
        state.senhaAnterior = '';
      })
      .addCase(atualizarSenha.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const { setSenhaAnterior, setNovaSenha, setConfirmarSenha, setErrors, resetStatus } =
  alterarSenhaSlice.actions;

export default alterarSenhaSlice.reducer;
