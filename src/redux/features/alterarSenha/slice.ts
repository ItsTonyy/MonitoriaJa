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

// AsyncThunk para atualizar senha no JSON Server
export const atualizarSenha = createAsyncThunk(
  'alterarSenha/atualizarSenha',
  async (senhaData: { senhaAnterior: string; novaSenha: string }, { getState }) => {
    const state = getState() as any;
    const currentUser = state.login.user; // ✅ Usuário logado
    
    // ✅ Atualizar senha no JSON Server
    const response = await fetch(`http://localhost:3000/usuarios/${currentUser.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: senhaData.novaSenha, // ✅ Campo 'password' no JSON
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar senha');
    }

    await response.json();
    return senhaData.novaSenha;
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