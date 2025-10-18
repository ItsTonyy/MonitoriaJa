// store/features/usuario/usuarioSlice.ts
import { createSlice, createAsyncThunk, createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import backendMock from "../../../backend-mock.json";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  role?: string;
}

// AsyncThunk: buscar usuário pelo id
export const fetchUsuario = createAsyncThunk<Usuario, string>(
  "usuario/fetchUsuario",
  async (id) => {
    const user = backendMock.usuarios.find((u) => u.id === id);
    if (!user) throw new Error("Usuário não encontrado");

    // Mapeia 'name' -> 'nome'
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      telefone: user.telefone,
      role: user.role,
    };
  }
);

// AsyncThunk: atualizar usuário (simulado)
export const updateUsuario = createAsyncThunk<Usuario, Partial<Usuario>>(
  "usuario/updateUsuario",
  async (updatedUser, { getState }) => {
    const state = getState() as any;
    const currentUser: Usuario = state.usuario.currentUser!;
    const newUser = { ...currentUser, ...updatedUser };

    // Simula persistência (localStorage)
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    return newUser;
  }
);

// EntityAdapter sem selectId (usa 'id' padrão)
const usuarioAdapter = createEntityAdapter<Usuario>();

const initialState = usuarioAdapter.getInitialState({
  currentUser: null as Usuario | null,
  loading: false,
  error: null as string | null,
});

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.loading = false;
        state.currentUser = action.payload;
        usuarioAdapter.setOne(state, action.payload); // adiciona ao entity state
      })
      .addCase(fetchUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar usuário";
      })

      // UPDATE
      .addCase(updateUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.currentUser = action.payload;
        usuarioAdapter.updateOne(state, { id: action.payload.id, changes: action.payload });
      });
  },
});

export default usuarioSlice.reducer;
