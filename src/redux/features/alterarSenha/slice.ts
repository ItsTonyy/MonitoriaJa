// slice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface AlterarSenhaState {
  senhaAnterior: string;
  novaSenha: string;
  confirmarSenha: string;
  errors: { anterior?: string; nova?: string; confirmar?: string }; // ✅ Corrigido o tipo
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
}

const initialState: AlterarSenhaState = {
  senhaAnterior: '',
  novaSenha: '',
  confirmarSenha: '',
  errors: {},
  status: 'idle',
  errorMessage: null,
};

// AsyncThunk para atualizar senha no JSON Server
export const atualizarSenha = createAsyncThunk(
  'alterarSenha/atualizarSenha',
  async (
    senhaData: { senhaAnterior: string; novaSenha: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const currentUser = state.login.user;

      console.log('🔍 DEBUG - Usuário atual:', currentUser);
      console.log('🔍 DEBUG - Senha anterior digitada:', senhaData.senhaAnterior);

      if (!currentUser) {
        return rejectWithValue('Usuário não encontrado');
      }

      // ✅ BUSCAR USUÁRIO COMPLETO DIRETO DO SERVIDOR (com a senha)
      const userResponse = await fetch(`http://localhost:3001/usuarios/${currentUser.id}`);
      if (!userResponse.ok) {
        return rejectWithValue('Erro ao buscar dados do usuário');
      }
      
      const userFromServer = await userResponse.json();
      
      console.log('🔍 DEBUG - Usuário do servidor:', userFromServer);
      console.log('🔍 DEBUG - Senha no servidor:', userFromServer.password);

      // ✅ AGORA comparar com a senha real do servidor
      if (userFromServer.password !== senhaData.senhaAnterior) {
        console.log('❌ Senha não coincide!');
        console.log('Esperado:', userFromServer.password);
        console.log('Recebido:', senhaData.senhaAnterior);
        return rejectWithValue('Senha anterior incorreta');
      }

      console.log('✅ Senha coincide! Prosseguindo...');

      // ✅ Atualizar senha no JSON Server
      const response = await fetch(`http://localhost:3001/usuarios/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: senhaData.novaSenha,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao comunicar com o servidor');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro desconhecido ao atualizar senha');
    }
  }
);

const alterarSenhaSlice = createSlice({
  name: 'alterarSenha',
  initialState,
  reducers: {
    setSenhaAnterior: (state, action: PayloadAction<string>) => {
      state.senhaAnterior = action.payload;
      // ✅ Limpar erro ao digitar
      if (state.errors.anterior) {
        state.errors.anterior = undefined;
      }
      if (state.errorMessage) {
        state.errorMessage = null;
      }
    },
    setNovaSenha: (state, action: PayloadAction<string>) => {
      state.novaSenha = action.payload;
      // ✅ Limpar erros de validação ao digitar
      if (state.errors.nova) {
        state.errors.nova = undefined;
      }
    },
    setConfirmarSenha: (state, action: PayloadAction<string>) => {
      state.confirmarSenha = action.payload;
      // ✅ Limpar erros de validação ao digitar
      if (state.errors.confirmar) {
        state.errors.confirmar = undefined;
      }
    },
    setErrors: (state, action: PayloadAction<{ anterior?: string; nova?: string; confirmar?: string }>) => {
      state.errors = action.payload;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.errorMessage = null;
    },
    resetForm: (state) => {
      // ✅ Resetar formulário completo
      state.senhaAnterior = '';
      state.novaSenha = '';
      state.confirmarSenha = '';
      state.errors = {};
      state.status = 'idle';
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(atualizarSenha.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(atualizarSenha.fulfilled, (state) => {
        state.status = 'success';
        state.senhaAnterior = '';
        state.novaSenha = '';
        state.confirmarSenha = '';
        state.errors = {};
        state.errorMessage = null;
      })
      .addCase(atualizarSenha.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload as string || 'Erro ao alterar senha';
      });
  },
});

export const {
  setSenhaAnterior,
  setNovaSenha,
  setConfirmarSenha,
  setErrors,
  resetStatus,
  resetForm,
} = alterarSenhaSlice.actions;

export default alterarSenhaSlice.reducer;