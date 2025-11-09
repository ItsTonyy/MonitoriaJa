import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Usuario } from "../../../models/usuario.model"

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

// Fetch
export const fetchUsuario = createAsyncThunk<Usuario, number>(
  "usuario/fetchUsuario",
  async (id) => {
    const response = await fetch(`http://localhost:3001/usuarios/${id}`);
    if (!response.ok) throw new Error("Usuário não encontrado");
    const user = await response.json();
    return { id: user.id, nome: user.nome, email: user.email, telefone: user.telefone || '', role: user.role || 'user' };
  }
);

// Update
export const updateUsuario = createAsyncThunk<Usuario, { nome: string; telefone: string; email: string }, { rejectValue: { validationErrors: { nome?: string; telefone?: string; email?: string } } }>(
  "usuario/updateUsuario",
  async (userData, { getState, rejectWithValue }) => {
    const validationErrors = {
      nome: validarNome(userData.nome),
      telefone: validarTelefone(userData.telefone),
      email: validarEmail(userData.email)
    };
    if (Object.values(validationErrors).some(e => e)) return rejectWithValue({ validationErrors });
    const state = getState() as any;
    const currentUser: Usuario = state.usuario.currentUser!;
    const newUser = { ...currentUser, ...userData };
    const response = await fetch(`http://localhost:3001/usuarios/${currentUser.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: newUser.nome, email: newUser.email, telefone: newUser.telefone }),
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
    clearValidationErrors: state => { state.validationErrors = {}; },
    validateField: (state, action: PayloadAction<{ field: keyof typeof state.validationErrors; value: string }>) => {
      const { field, value } = action.payload;
      switch (field) {
        case 'nome': state.validationErrors.nome = validarNome(value); break;
        case 'telefone': state.validationErrors.telefone = validarTelefone(value); break;
        case 'email': state.validationErrors.email = validarEmail(value); break;
      }
    },
    clearError: state => { state.error = null; }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsuario.pending, state => { state.loading = true; state.error = null; state.validationErrors = {}; })
      .addCase(fetchUsuario.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; state.validationErrors = {}; })
      .addCase(fetchUsuario.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Erro ao carregar usuário"; state.validationErrors = {}; })
      .addCase(updateUsuario.pending, state => { state.loading = true; state.error = null; state.validationErrors = {}; })
      .addCase(updateUsuario.fulfilled, (state, action) => { state.loading = false; state.currentUser = action.payload; state.validationErrors = {}; })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && 'validationErrors' in action.payload) {
          state.validationErrors = action.payload.validationErrors;
        } else {
          state.error = action.error.message || "Erro ao atualizar usuário";
          state.validationErrors = {};
        }
      });
  },
});

export const { clearValidationErrors, validateField, clearError } = usuarioSlice.actions;
export default usuarioSlice.reducer;
