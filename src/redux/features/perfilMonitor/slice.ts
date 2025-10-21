import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Monitor {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role?: string;
  descricao: string;
  materias: string[];
  fotoUrl?: string; // 🔹 Adicionado para suportar foto
}

interface ValidationErrors {
  nome?: string;
  telefone?: string;
  email?: string;
  descricao?: string;
}

// Regex de validação
const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Função de validação
const validateMonitorField = (field: keyof ValidationErrors, value: string): string | undefined => {
  switch (field) {
    case 'nome':
      if (!value || value.trim().length === 0) return 'Nome é obrigatório';
      if (value.trim().length < 3) return 'Nome deve ter pelo menos 3 caracteres';
      return undefined;
    case 'telefone':
      if (!value || value.trim().length === 0) return 'Telefone é obrigatório';
      if (!telefoneRegex.test(value)) return 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX';
      return undefined;
    case 'email':
      if (!value || value.trim().length === 0) return 'Email é obrigatório';
      if (!emailRegex.test(value)) return 'Email inválido';
      return undefined;
    case 'descricao':
      if (value && value.trim().length > 0 && value.trim().length < 10)
        return 'Descrição deve ter pelo menos 10 caracteres';
      return undefined;
    default:
      return undefined;
  }
};

// AsyncThunk: buscar monitor pelo id
export const fetchMonitor = createAsyncThunk<Monitor, number>(
  "monitor/fetchMonitor",
  async (id) => {
    const response = await fetch(`http://localhost:3001/usuarios/${id}`);
    if (!response.ok) throw new Error("Monitor não encontrado");
    const user = await response.json();

    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      telefone: user.telefone || '',
      role: user.role || 'user',
      descricao: user.description || '',
      materias: user.materias || [],
      fotoUrl: user.fotoUrl || '', // 🔹 Incluído
    };
  }
);

// AsyncThunk: atualizar monitor
export const updateMonitor = createAsyncThunk<
  Monitor,
  Partial<Omit<Monitor, 'id' | 'role'>>
>(
  "monitor/updateMonitor",
  async (updatedMonitor, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const currentMonitor: Monitor = state.perfilMonitor.currentMonitor!;

    // Validar campos antes de enviar
    const errors: ValidationErrors = {};

    if (updatedMonitor.nome !== undefined) {
      const nomeError = validateMonitorField('nome', updatedMonitor.nome);
      if (nomeError) errors.nome = nomeError;
    }
    if (updatedMonitor.telefone !== undefined) {
      const telefoneError = validateMonitorField('telefone', updatedMonitor.telefone);
      if (telefoneError) errors.telefone = telefoneError;
    }
    if (updatedMonitor.email !== undefined) {
      const emailError = validateMonitorField('email', updatedMonitor.email);
      if (emailError) errors.email = emailError;
    }
    if (updatedMonitor.descricao !== undefined) {
      const descricaoError = validateMonitorField('descricao', updatedMonitor.descricao);
      if (descricaoError) errors.descricao = descricaoError;
    }

    if (Object.keys(errors).length > 0) {
      return rejectWithValue(errors);
    }

    const newMonitor = { ...currentMonitor, ...updatedMonitor };

    const response = await fetch(`http://localhost:3001/usuarios/${currentMonitor.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newMonitor.nome,
        email: newMonitor.email,
        telefone: newMonitor.telefone,
        description: newMonitor.descricao,
        materias: newMonitor.materias,
        fotoUrl: newMonitor.fotoUrl || '', // 🔹 Incluído
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar monitor no servidor');
    }

    await response.json();
    return newMonitor;
  }
);

interface MonitorState {
  currentMonitor: Monitor | null;
  loading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;
}

const initialState: MonitorState = {
  currentMonitor: null,
  loading: false,
  error: null,
  validationErrors: {},
};

const monitorSlice = createSlice({
  name: "monitor",
  initialState,
  reducers: {
    validateField: (state, action: PayloadAction<{ field: keyof ValidationErrors; value: string }>) => {
      const { field, value } = action.payload;
      const error = validateMonitorField(field, value);
      if (error) state.validationErrors[field] = error;
      else delete state.validationErrors[field];
    },
    clearValidationErrors: (state) => { state.validationErrors = {}; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonitor.fulfilled, (state, action: PayloadAction<Monitor>) => {
        state.loading = false;
        state.currentMonitor = action.payload;
        state.validationErrors = {};
      })
      .addCase(fetchMonitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Monitor não encontrado";
      })
      .addCase(updateMonitor.pending, (state) => { state.loading = true; })
      .addCase(updateMonitor.fulfilled, (state, action: PayloadAction<Monitor>) => {
        state.loading = false;
        state.currentMonitor = action.payload;
        state.validationErrors = {};
        state.error = null;
      })
      .addCase(updateMonitor.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) state.validationErrors = action.payload as ValidationErrors;
        else state.error = action.error.message || "Erro ao atualizar monitor";
      });
  },
});

export const { validateField, clearValidationErrors, clearError } = monitorSlice.actions;
export default monitorSlice.reducer;
