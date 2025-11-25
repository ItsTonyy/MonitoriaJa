// redux/features/perfilUsuario/slice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Usuario } from "../../../models/usuario.model";
import { getToken, getUserIdFromToken, isTokenExpired } from "../../../pages/Pagamento/Cartao/CadastraCartao/authUtils";

interface UsuarioState {
  currentUser: Usuario | null;
  loading: boolean;
  error: string | null;
  validationErrors: {
    nome?: string;
    telefone?: string;
    email?: string;
  };
}

const initialState: UsuarioState = {
  currentUser: null,
  loading: false,
  error: null,
  validationErrors: {}
};

// Funções de validação
const validarNome = (nome: string) => (!nome.trim() ? 'Nome não pode ser vazio' : undefined);

const validarTelefone = (tel: string) => {
  const limpo = tel.replace(/\D/g, '');
  if (!limpo) return 'Telefone é obrigatório';
  if (limpo.length !== 11) return 'Telefone deve ter 11 dígitos';
  if (limpo[2] !== '9') return 'O terceiro dígito deve ser 9';
  return undefined;
};

const validarEmail = (email: string) => {
  if (!email.trim()) return 'Email é obrigatório';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email) ? undefined : 'Email deve ter formato: <e-mail>@<domínio>';
};

// Thunk: Buscar usuário autenticado ou específico por ID
export const fetchUsuario = createAsyncThunk<
  Usuario,
  string,
  { rejectValue: string }
>(
  "usuario/fetchUsuario",
  async (userId, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');
      
      if (!token || isTokenExpired()) {
        console.log('❌ Token inválido ou expirado');
        return rejectWithValue("Token inválido ou expirado. Faça login novamente.");
      }

      console.log('👤 UserID recebido no fetchUsuario:', userId);

      const url = `http://localhost:3001/usuario/${userId}`;
      console.log('🌐 Fazendo requisição para:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Erro na resposta:', errorText);
        
        if (response.status === 404) {
          return rejectWithValue("Usuário não encontrado");
        }
        if (response.status === 401) {
          return rejectWithValue("Não autorizado. Faça login novamente.");
        }
        if (response.status === 403) {
          return rejectWithValue("Acesso negado");
        }
        throw new Error("Erro ao buscar usuário");
      }

      const data = await response.json();
      console.log('✅ Dados recebidos:', data);
      
      return {
        id: data._id || data.id,
        nome: data.nome,
        email: data.email,
        telefone: data.telefone || '',
        foto: data.foto || '',
        tipoUsuario: data.tipoUsuario || 'ALUNO'
      };
    } catch (error: any) {
      console.error('💥 Erro no catch:', error);
      return rejectWithValue(error.message || "Erro ao carregar usuário");
    }
  }
);

// Thunk: Atualizar usuário - AGORA RECEBE fotoUrl EM VEZ DE fotoFile
export const updateUsuario = createAsyncThunk<
  Usuario,
  { 
    nome: string; 
    telefone: string; 
    email: string; 
    fotoUrl?: string; // ✅ MUDANÇA: Recebe URL da foto, não o arquivo
  },
  { rejectValue: { validationErrors?: { nome?: string; telefone?: string; email?: string }; message?: string } }
>(
  "usuario/updateUsuario",
  async (userData, { getState, rejectWithValue }) => {
    console.log('🔄 Iniciando updateUsuario com dados:', userData);
    
    try {
      // Validações
      const validationErrors = {
        nome: validarNome(userData.nome),
        telefone: validarTelefone(userData.telefone),
        email: validarEmail(userData.email)
      };

      if (Object.values(validationErrors).some(e => e)) {
        console.log('❌ Erros de validação encontrados');
        return rejectWithValue({ validationErrors });
      }

      // Verifica token
      const token = getToken();
      if (!token || isTokenExpired()) {
        return rejectWithValue({ message: "Token inválido ou expirado. Faça login novamente." });
      }

      // Pega usuário atual do estado
      const state = getState() as any;
      const currentUser: Usuario | null = state.usuario?.currentUser;

      if (!currentUser || !currentUser.id) {
        return rejectWithValue({ message: "Usuário não encontrado no estado. Recarregue a página." });
      }

      console.log('👤 Atualizando usuário ID:', currentUser.id);

      // Prepara o payload
      const payload: any = {
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
      };

      // ✅ MUDANÇA: Se houver fotoUrl, inclui no payload
      if (userData.fotoUrl) {
        payload.foto = userData.fotoUrl;
        console.log('📸 Foto URL incluída no payload:', userData.fotoUrl);
      }

      console.log('📝 Dados enviados para atualização:', payload);

      // Faz a requisição PATCH para atualizar o usuário
      const response = await fetch(`http://localhost:3001/usuario/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue({ message: "Não autorizado. Faça login novamente." });
        }
        if (response.status === 400) {
          const errorData = await response.json();
          return rejectWithValue({ message: errorData.message || "Dados inválidos" });
        }
        throw new Error('Erro ao atualizar usuário');
      }

      const result = await response.json();
      console.log('✅ Resposta do servidor:', result);

      // Atualiza o usuário no estado
      const updatedUser: Usuario = {
        ...currentUser,
        nome: userData.nome,
        email: userData.email,
        telefone: userData.telefone,
        ...(userData.fotoUrl && { foto: userData.fotoUrl }) // ✅ Atualiza foto se houver nova URL
      };

      // Atualiza localStorage se for o usuário logado
      const loggedUserId = getUserIdFromToken();
      if (loggedUserId === currentUser.id) {
        const userInStorage = localStorage.getItem("user");
        if (userInStorage) {
          const parsedUser = JSON.parse(userInStorage);
          localStorage.setItem("user", JSON.stringify({ ...parsedUser, ...updatedUser }));
        }
      }

      return updatedUser;
    } catch (error: any) {
      console.error('💥 Erro:', error);
      return rejectWithValue({ message: error.message || "Erro ao atualizar usuário" });
    }
  }
);

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    clearValidationErrors: state => {
      state.validationErrors = {};
    },
    validateField: (state, action: PayloadAction<{ field: keyof typeof state.validationErrors; value: string }>) => {
      const { field, value } = action.payload;
      switch (field) {
        case 'nome':
          state.validationErrors.nome = validarNome(value);
          break;
        case 'telefone':
          state.validationErrors.telefone = validarTelefone(value);
          break;
        case 'email':
          state.validationErrors.email = validarEmail(value);
          break;
      }
    },
    clearError: state => {
      state.error = null;
    },
    clearCurrentUser: state => {
      state.currentUser = null;
      state.error = null;
      state.validationErrors = {};
    }
  },
  extraReducers: builder => {
    builder
      // fetchUsuario
      .addCase(fetchUsuario.pending, state => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(fetchUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.validationErrors = {};
      })
      .addCase(fetchUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao carregar usuário";
        state.validationErrors = {};
      })
      // updateUsuario
      .addCase(updateUsuario.pending, state => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateUsuario.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.validationErrors = {};
      })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && 'validationErrors' in action.payload && action.payload.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        } else {
          state.error = action.payload?.message || "Erro ao atualizar usuário";
          state.validationErrors = {};
        }
      });
  },
});

export const { clearValidationErrors, validateField, clearError, clearCurrentUser } = usuarioSlice.actions;
export default usuarioSlice.reducer;