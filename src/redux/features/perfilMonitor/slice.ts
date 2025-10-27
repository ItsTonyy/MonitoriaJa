import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Disponibilidade } from '../../../models/disponibilidade.model';

// Tipos
export interface Monitor {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  role?: string;
  descricao: string;
  materias: string[];
  fotoUrl?: string;
  listaDisponibilidades: Disponibilidade[];
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
      if (value && value.trim().length > 0 && value.trim().length < 10) return 'Descrição deve ter pelo menos 10 caracteres';
      return undefined;
    default:
      return undefined;
  }
};

// AsyncThunk: buscar monitor pelo id - CORRIGIDO
export const fetchMonitor = createAsyncThunk<Monitor, number>(
  "monitor/fetchMonitor",
  async (id) => {
    const response = await fetch(`http://localhost:3001/usuarios/${id}`);
    if (!response.ok) throw new Error("Monitor não encontrado");
    const user = await response.json();
    
    console.log('Dados brutos da API para monitor ID', id, ':', user);
    
    return {
      id: user.id,
      nome: user.name || user.nome || '',
      email: user.email || '',
      telefone: user.telefone || user.phone || '',
      role: user.role || 'user',
      descricao: user.description || user.descricao || '',
      materias: user.materias || user.subjects || [],
      fotoUrl: user.fotoUrl || user.foto || user.photo || '',
      listaDisponibilidades: user.listaDisponibilidades || user.disponibilidades || [],
    };
  }
);

// AsyncThunk: atualizar monitor - CORRIGIDO
export const updateMonitor = createAsyncThunk<
  Monitor,
  Partial<Omit<Monitor, 'id' | 'role'>>
>(
  "monitor/updateMonitor",
  async (updatedMonitor, { getState, rejectWithValue }) => {
    const state = getState() as any;
    const currentMonitor: Monitor = state.perfilMonitor.currentMonitor!;

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

    const newMonitor = {
      ...currentMonitor,
      ...updatedMonitor
    };

    const response = await fetch(`http://localhost:3001/usuarios/${currentMonitor.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newMonitor.nome,
        email: newMonitor.email,
        telefone: newMonitor.telefone,
        description: newMonitor.descricao,
        materias: newMonitor.materias,
        fotoUrl: newMonitor.fotoUrl || '',
        listaDisponibilidades: newMonitor.listaDisponibilidades,
        role: newMonitor.role || 'monitor'
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar monitor no servidor');
    }

    await response.json();
    return newMonitor;
  }
);

// AsyncThunk: buscar disciplinas do backend
export const fetchDisciplinas = createAsyncThunk<{ id: string; nome: string }[]>(
  "perfilMonitor/fetchDisciplinas",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/disciplinas");
      if (!response.ok) throw new Error("Erro ao buscar disciplinas");
      const data = await response.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message || "Erro ao buscar disciplinas");
    }
  }
);

interface MonitorState {
  currentMonitor: Monitor | null;
  materiasDisponiveis: { id: string; nome: string }[];
  loading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;
}

const initialState: MonitorState = {
  currentMonitor: null,
  materiasDisponiveis: [],
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
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    },
    clearError: (state) => {
      state.error = null;
    },
    atualizarDescricao: (state, action: PayloadAction<string>) => {
      if (state.currentMonitor) state.currentMonitor.descricao = action.payload;
    },
    atualizarContato: (state, action: PayloadAction<{ telefone: string; email: string }>) => {
      if (state.currentMonitor) {
        state.currentMonitor.telefone = action.payload.telefone;
        state.currentMonitor.email = action.payload.email;
      }
    },
    atualizarMaterias: (state, action: PayloadAction<string[]>) => {
      if (state.currentMonitor) state.currentMonitor.materias = action.payload;
    },
    atualizarDisponibilidades: (state, action: PayloadAction<Disponibilidade[]>) => {
      if (state.currentMonitor) state.currentMonitor.listaDisponibilidades = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonitor.pending, (state) => { state.loading = true; state.error = null; })
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
      })
      .addCase(fetchDisciplinas.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDisciplinas.fulfilled, (state, action: PayloadAction<{ id: string; nome: string }[]>) => {
        state.loading = false;
        state.materiasDisponiveis = action.payload;
      })
      .addCase(fetchDisciplinas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Erro ao buscar disciplinas";
      });
  },
});

export const {
  validateField,
  clearValidationErrors,
  clearError,
  atualizarDescricao,
  atualizarContato,
  atualizarMaterias,
  atualizarDisponibilidades,
} = monitorSlice.actions;

export default monitorSlice.reducer;