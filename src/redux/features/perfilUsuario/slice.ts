// store/features/usuario/usuarioSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role?: string;
}

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

// Validações no Redux
const validarNome = (nome: string): string | undefined => {
  if (!nome.trim()) return 'Nome não pode ser vazio';
  return undefined;
};

const validarTelefone = (telefone: string): string | undefined => {
  const telefoneLimpo = telefone.replace(/\D/g, '');
  
  if (!telefoneLimpo) return 'Telefone é obrigatório';
  if (telefoneLimpo.length !== 11) return 'Telefone deve ter 11 dígitos';
  if (telefoneLimpo[2] !== '9') return 'O terceiro dígito deve ser 9';
  
  return undefined;
};

const validarEmail = (email: string): string | undefined => {
  if (!email.trim()) return 'Email é obrigatório';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email deve ter formato: <e-mail>@<domínio>';
  
  return undefined;
};

// AsyncThunk: buscar usuário
export const fetchUsuario = createAsyncThunk<Usuario, number>(
  "usuario/fetchUsuario",
  async (id) => {
    const response = await fetch(`http://localhost:3001/usuarios/${id}`);
    if (!response.ok) throw new Error("Usuário não encontrado");

    const user = await response.json();
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      telefone: user.telefone || '',
      role: user.role || 'user',
    };
  }
);

// AsyncThunk: atualizar usuário
export const updateUsuario = createAsyncThunk<
  Usuario, 
  { nome: string; telefone: string; email: string },
  { rejectValue: { validationErrors: { nome?: string; telefone?: string; email?: string } } }
>(
  "usuario/updateUsuario",
  async (userData, { getState, rejectWithValue }) => {
    // Validação no Redux antes de fazer a requisição
    const validationErrors = {
      nome: validarNome(userData.nome),
      telefone: validarTelefone(userData.telefone),
      email: validarEmail(userData.email)
    };

    // Se há erros de validação, rejeita com os erros
    const hasErrors = Object.values(validationErrors).some(error => error !== undefined);
    if (hasErrors) {
      return rejectWithValue({ validationErrors });
    }

    const state = getState() as any;
    const currentUser: Usuario = state.usuario.currentUser!;
    const newUser = { ...currentUser, ...userData };

    const response = await fetch(`http://localhost:3001/usuarios/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newUser.nome,
        email: newUser.email,
        telefone: newUser.telefone,
      }),
    });

    if (!response.ok) throw new Error('Erro ao atualizar usuário');

    await response.json();

    localStorage.setItem("user", JSON.stringify(newUser));
    return newUser;
  }
);

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    clearValidationErrors: (state) => {
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
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCH USUARIO
      .addCase(fetchUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(fetchUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.validationErrors = {};
      })
      .addCase(fetchUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar usuário";
        state.validationErrors = {};
      })
      // UPDATE USUARIO
      .addCase(updateUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.validationErrors = {};
      })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.loading = false;
        
        // Verifica se é erro de validação - apenas atualiza os validationErrors, não seta error global
        if (action.payload && 'validationErrors' in action.payload) {
          state.validationErrors = action.payload.validationErrors;
          // Não seta error global para erros de validação
        } else {
          state.error = action.error.message || "Erro ao atualizar usuário";
          state.validationErrors = {};
        }
      });
  },
});

export const { clearValidationErrors, validateField, clearError } = usuarioSlice.actions;
export default usuarioSlice.reducer;