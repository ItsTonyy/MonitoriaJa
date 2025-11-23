import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserIdFromToken, getToken } from '../../../pages/Pagamento/Cartao/CadastraCartao/authUtils';

interface AlterarSenhaState {
  senhaAnterior: string;
  novaSenha: string;
  confirmarSenha: string;
  errors: { anterior?: string; nova?: string; confirmar?: string };
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  modoAdmin: boolean;
  userIdAlvo?: string;
}

const initialState: AlterarSenhaState = {
  senhaAnterior: '',
  novaSenha: '',
  confirmarSenha: '',
  errors: {},
  status: 'idle',
  errorMessage: null,
  modoAdmin: false,
  userIdAlvo: undefined,
};

// ✅ AsyncThunk para usuário comum (com senha anterior)
export const atualizarSenha = createAsyncThunk(
  'alterarSenha/atualizarSenha',
  async (
    senhaData: { senhaAnterior: string; novaSenha: string },
    { rejectWithValue }
  ) => {
    try {
      const userId = getUserIdFromToken(); // ✅ Usando getUserIdFromToken
      
      if (!userId) {
        return rejectWithValue('Usuário não autenticado. Faça login novamente.');
      }

      console.log('🔍 USUÁRIO COMUM - Alterando própria senha');
      console.log('🔍 UserID:', userId);

      const response = await fetch(`http://localhost:3001/usuario/${userId}/alterar-senha`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          senhaAnterior: senhaData.senhaAnterior,
          novaSenha: senhaData.novaSenha
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Erro ao alterar senha');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro de conexão com o servidor');
    }
  }
);

// ✅ AsyncThunk para admin alterar senha de outros usuários
export const atualizarSenhaAdmin = createAsyncThunk(
  'alterarSenha/atualizarSenhaAdmin',
  async (
    senhaData: { novaSenha: string; userIdAlvo: string },
    { rejectWithValue }
  ) => {
    try {
      console.log('🔍 ADMIN - Iniciando alteração de senha...');
      console.log('🔍 ADMIN - UserID Alvo:', senhaData.userIdAlvo);
      
      const token = getToken();
      if (!token) {
        return rejectWithValue('Token não encontrado');
      }

      const response = await fetch(`http://localhost:3001/usuario/${senhaData.userIdAlvo}/alterar-senha-admin`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          novaSenha: senhaData.novaSenha
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Erro ao alterar senha');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro de conexão com o servidor');
    }
  }
);

const alterarSenhaSlice = createSlice({
  name: 'alterarSenha',
  initialState,
  reducers: {
    setSenhaAnterior: (state, action: PayloadAction<string>) => {
      state.senhaAnterior = action.payload;
      if (state.errors.anterior) {
        state.errors.anterior = undefined;
      }
      if (state.errorMessage) {
        state.errorMessage = null;
      }
    },
    setNovaSenha: (state, action: PayloadAction<string>) => {
      state.novaSenha = action.payload;
      if (state.errors.nova) {
        state.errors.nova = undefined;
      }
    },
    setConfirmarSenha: (state, action: PayloadAction<string>) => {
      state.confirmarSenha = action.payload;
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
      state.senhaAnterior = '';
      state.novaSenha = '';
      state.confirmarSenha = '';
      state.errors = {};
      state.status = 'idle';
      state.errorMessage = null;
    },
    // ✅ Reducers para modo admin
    ativarModoAdmin: (state, action: PayloadAction<string>) => {
      state.modoAdmin = true;
      state.userIdAlvo = action.payload;
      state.senhaAnterior = ''; // Limpa senha anterior no modo admin
      state.errors = {}; // Limpa erros
      state.errorMessage = null; // Limpa mensagem de erro
    },
    desativarModoAdmin: (state) => {
      state.modoAdmin = false;
      state.userIdAlvo = undefined;
      state.senhaAnterior = '';
      state.errors = {};
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Caso usuário comum
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
      })
      // ✅ Caso admin
      .addCase(atualizarSenhaAdmin.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(atualizarSenhaAdmin.fulfilled, (state) => {
        state.status = 'success';
        state.novaSenha = '';
        state.confirmarSenha = '';
        state.errors = {};
        state.errorMessage = null;
      })
      .addCase(atualizarSenhaAdmin.rejected, (state, action) => {
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
  ativarModoAdmin,
  desativarModoAdmin,
} = alterarSenhaSlice.actions;

export default alterarSenhaSlice.reducer;