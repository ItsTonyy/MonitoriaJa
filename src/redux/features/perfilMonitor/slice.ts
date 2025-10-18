import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Monitor {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role?: string;
  // ✅ ELEMENTOS EXTRA DO MONITOR
  descricao: string;
  materias: string[];
}

// AsyncThunk: buscar monitor pelo id
// AsyncThunk: buscar monitor pelo id - CORRIGIDO
export const fetchMonitor = createAsyncThunk<Monitor, number>(
  "monitor/fetchMonitor",
  async (id) => {
    const response = await fetch(`http://localhost:3000/usuarios/${id}`);
    
    if (!response.ok) throw new Error("Monitor não encontrado");

    const user = await response.json();
    console.log('📦 Dados recebidos do servidor:', user); // ← DEBUG
    
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      telefone: user.telefone || '',
      role: user.role || 'user',
      // ✅ CORREÇÃO: Mapear 'description' do JSON para 'descricao' do frontend
      descricao: user.description || '',  // ← 'description' do JSON → 'descricao' no frontend
      materias: user.materias || [],
    };
  }
);

// AsyncThunk: atualizar monitor - CORRIGIDO  
export const updateMonitor = createAsyncThunk<Monitor, Partial<Monitor>>(
  "monitor/updateMonitor",
  async (updatedMonitor, { getState }) => {
    const state = getState() as any;
    const currentMonitor: Monitor = state.monitor.currentMonitor!;
    const newMonitor = { ...currentMonitor, ...updatedMonitor };

    const response = await fetch(`http://localhost:3000/usuarios/${currentMonitor.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: newMonitor.nome,
        email: newMonitor.email,
        telefone: newMonitor.telefone,
        // ✅ CORREÇÃO: Enviar como 'description' para o JSON Server
        description: newMonitor.descricao,  // ← 'descricao' do frontend → 'description' no JSON
        materias: newMonitor.materias,
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar monitor no servidor');
    }

    await response.json();
    localStorage.setItem("monitor", JSON.stringify(newMonitor));
    return newMonitor;
  }
);

const initialState = {
  currentMonitor: null as Monitor | null,
  loading: false,
  error: null as string | null,
};

const monitorSlice = createSlice({
  name: "monitor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchMonitor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitor.fulfilled, (state, action: PayloadAction<Monitor>) => {
        state.loading = false;
        state.currentMonitor = action.payload;
      })
      .addCase(fetchMonitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao carregar monitor";
      })
      // UPDATE
      .addCase(updateMonitor.fulfilled, (state, action: PayloadAction<Monitor>) => {
        state.currentMonitor = action.payload;
      })
      .addCase(updateMonitor.rejected, (state, action) => {
        state.error = action.error.message || "Erro ao atualizar monitor";
      });
  },
});

export default monitorSlice.reducer;