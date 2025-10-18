// store/features/usuario/usuarioSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role?: string;
}

// AsyncThunk: buscar usuário pelo id - PORTA 3000
export const fetchUsuario = createAsyncThunk<Usuario, number>(
  "usuario/fetchUsuario",
  async (id) => {
    const response = await fetch(`http://localhost:3000/usuarios/${id}`); // ✅ porta 3000
    
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

// AsyncThunk: atualizar usuário - PORTA 3000
export const updateUsuario = createAsyncThunk<Usuario, Partial<Usuario>>(
  "usuario/updateUsuario",
  async (updatedUser, { getState }) => {
    const state = getState() as any;
    const currentUser: Usuario = state.usuario.currentUser!;
    const newUser = { ...currentUser, ...updatedUser };

    // ✅ ATUALIZAR NO JSON SERVER (porta 3000)
    const response = await fetch(`http://localhost:3000/usuarios/${currentUser.id}`, { // ✅ porta 3000
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newUser.nome,
        email: newUser.email,
        telefone: newUser.telefone,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar usuário no servidor');
    }

    await response.json();

    // ✅ ATUALIZAR NO LOCALSTORAGE
    localStorage.setItem("user", JSON.stringify(newUser));

    return newUser;
  }
);

const initialState = {
  currentUser: null as Usuario | null,
  loading: false,
  error: null as string | null,
};

const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsuario.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUsuario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar usuário";
      })
      .addCase(updateUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.currentUser = action.payload;
      })
      .addCase(updateUsuario.rejected, (state, action) => {
        state.error = action.error.message || "Erro ao atualizar usuário";
      });
  },
});

export default usuarioSlice.reducer;