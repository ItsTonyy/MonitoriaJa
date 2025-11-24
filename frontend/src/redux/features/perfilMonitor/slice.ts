import { getToken, getUserIdFromToken, isTokenExpired } from "../../../pages/Pagamento/Cartao/CadastraCartao/authUtils";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Disponibilidade } from '../../../models/disponibilidade.model';

// Interface específica para Monitor
interface Monitor {
  id?: string;
  nome?: string;
  email?: string;
  telefone?: string;
  foto?: string;
  tipoUsuario?: "ALUNO" | "ADMIN" | "MONITOR";
  biografia?: string;
  materia?: string[];
  avaliacao?: number;
  formacao?: string;
  listaDisponibilidades?: Disponibilidade[];
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

// AsyncThunk: buscar monitor pelo id
export const fetchMonitor = createAsyncThunk<
  Monitor,
  string | undefined,
  { rejectValue: string }
>(
  "perfilMonitor/fetchMonitor",
  async (monitorId, { rejectWithValue }) => {
    try {
      const token = getToken();
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');
      
      if (!token || isTokenExpired()) {
        console.log('❌ Token inválido ou expirado');
        return rejectWithValue("Token inválido ou expirado. Faça login novamente.");
      }

      const targetMonitorId = monitorId || getUserIdFromToken();
      console.log('👤 Target Monitor ID:', targetMonitorId);
      
      if (!targetMonitorId) {
        console.log('❌ ID do monitor não encontrado');
        return rejectWithValue("ID do monitor não encontrado");
      }

      const url = `http://localhost:3001/usuario/${targetMonitorId}`;
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
          return rejectWithValue("Monitor não encontrado");
        }
        if (response.status === 401) {
          return rejectWithValue("Não autorizado. Faça login novamente.");
        }
        throw new Error("Erro ao buscar monitor");
      }

      const user = await response.json();
      console.log('✅ Dados recebidos:', user);
      
      // Normalizar materia para sempre ser array
      let materias: string[] = [];
      if (user.materia) {
        if (Array.isArray(user.materia)) {
          materias = user.materia;
        } else if (typeof user.materia === 'string') {
          materias = [user.materia];
        }
      }
      // Tratar listaDisciplinas se vier do backend
      if (user.listaDisciplinas && Array.isArray(user.listaDisciplinas)) {
        materias = user.listaDisciplinas;
      }
      
      return {
        id: user.id || user._id,
        nome: user.nome || user.name || '',
        email: user.email || '',
        telefone: user.telefone || user.phone || '',
        tipoUsuario: user.tipoUsuario || 'MONITOR',
        biografia: user.biografia || user.description || '',
        materia: materias,
        foto: user.foto || user.fotoUrl || user.photo || '',
        avaliacao: user.avaliacao || 0,
        formacao: user.formacao || '',
        listaDisponibilidades: user.listaDisponibilidades || user.disponibilidades || [],
      };
    } catch (error: any) {
      console.error('💥 Erro no catch:', error);
      return rejectWithValue(error.message || "Erro ao carregar monitor");
    }
  }
);

// AsyncThunk: atualizar monitor - AGORA RECEBE fotoUrl EM VEZ DE FILE
export const updateMonitor = createAsyncThunk<
  Monitor,
  {
    nome: string;
    telefone: string;
    email: string;
    biografia?: string;
    materia?: string[];
    fotoUrl?: string; // ✅ MUDANÇA: Recebe URL da foto, não o arquivo
    listaDisponibilidades?: Disponibilidade[];
  },
  { rejectValue: { validationErrors?: ValidationErrors; message?: string } }
>(
  "perfilMonitor/updateMonitor",
  async (updateData, { getState, rejectWithValue }) => {
    console.log('🔄 Iniciando updateMonitor com dados:', updateData);
    
    try {
      // Validações
      const errors: ValidationErrors = {};
      errors.nome = validateMonitorField('nome', updateData.nome);
      errors.telefone = validateMonitorField('telefone', updateData.telefone);
      errors.email = validateMonitorField('email', updateData.email);
      if (updateData.biografia) {
        errors.descricao = validateMonitorField('descricao', updateData.biografia);
      }

      // Remove erros undefined
      Object.keys(errors).forEach(key => {
        if (errors[key as keyof ValidationErrors] === undefined) {
          delete errors[key as keyof ValidationErrors];
        }
      });

      console.log('✅ Validações:', errors);

      if (Object.keys(errors).length > 0) {
        console.log('❌ Erros de validação encontrados');
        return rejectWithValue({ validationErrors: errors });
      }

      // Verifica token
      const token = getToken();
      if (!token || isTokenExpired()) {
        return rejectWithValue({ message: "Token inválido ou expirado. Faça login novamente." });
      }

      // Pega monitor atual do estado
      const state = getState() as any;
      console.log('🗂️ Estado completo:', state);
      console.log('👤 State.perfilMonitor:', state.perfilMonitor);
      
      const currentMonitor: Monitor | null = state.perfilMonitor?.currentMonitor;

      if (!currentMonitor || !currentMonitor.id) {
        console.error('❌ CurrentMonitor não encontrado:', currentMonitor);
        console.error('❌ Estado disponível:', Object.keys(state));
        return rejectWithValue({ message: "Monitor não encontrado no estado. Recarregue a página." });
      }

      console.log('👤 Atualizando monitor:', currentMonitor.id);

      // Prepara o body da requisição
      const requestBody: any = {
        nome: updateData.nome,
        email: updateData.email,
        telefone: updateData.telefone,
      };

      if (updateData.biografia) requestBody.biografia = updateData.biografia;
      if (updateData.materia) requestBody.listaDisciplinas = updateData.materia; // Backend usa listaDisciplinas
      // ✅ MUDANÇA: Se houver fotoUrl, inclui no payload
      if (updateData.fotoUrl) requestBody.foto = updateData.fotoUrl;
      if (updateData.listaDisponibilidades) requestBody.listaDisponibilidades = updateData.listaDisponibilidades;

      console.log('📝 Dados enviados para atualização:', requestBody);

      // Faz a requisição PATCH
      const response = await fetch(`http://localhost:3001/usuario/${currentMonitor.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Status da resposta:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue({ message: "Não autorizado. Faça login novamente." });
        }
        if (response.status === 400) {
          const errorData = await response.json();
          return rejectWithValue({ message: errorData.message || "Dados inválidos" });
        }
        throw new Error('Erro ao atualizar monitor');
      }

      const result = await response.json();
      console.log('✅ Resposta do servidor:', result);

      // Atualiza o monitor no estado
      const updatedMonitor: Monitor = {
        ...currentMonitor,
        nome: updateData.nome,
        email: updateData.email,
        telefone: updateData.telefone,
      };

      if (updateData.biografia !== undefined) {
        updatedMonitor.biografia = updateData.biografia;
      }
      if (updateData.materia !== undefined) {
        updatedMonitor.materia = updateData.materia;
      }
      // ✅ MUDANÇA: Atualiza foto se houver nova URL
      if (updateData.fotoUrl !== undefined) {
        updatedMonitor.foto = updateData.fotoUrl;
      }
      if (updateData.listaDisponibilidades !== undefined) {
        updatedMonitor.listaDisponibilidades = updateData.listaDisponibilidades;
      }

      // Atualiza localStorage se for o monitor logado
      const loggedUserId = getUserIdFromToken();
      if (loggedUserId === currentMonitor.id) {
        const userInStorage = localStorage.getItem("user");
        if (userInStorage) {
          const parsedUser = JSON.parse(userInStorage);
          localStorage.setItem("user", JSON.stringify({ ...parsedUser, ...updatedMonitor }));
        }
      }

      return updatedMonitor;
    } catch (error: any) {
      console.error('💥 Erro no catch:', error);
      return rejectWithValue({ message: error.message || "Erro ao atualizar monitor" });
    }
  }
);

// AsyncThunk: buscar disciplinas do backend
export const fetchDisciplinas = createAsyncThunk<
  { id: string; nome: string }[],
  void,
  { rejectValue: string }
>(
  "perfilMonitor/fetchDisciplinas",
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      
      const response = await fetch("http://localhost:3001/disciplina", {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json'
        }
      });
      
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

const perfilMonitorSlice = createSlice({
  name: "perfilMonitor",
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
    clearCurrentMonitor: (state) => {
      state.currentMonitor = null;
      state.error = null;
      state.validationErrors = {};
    },
    atualizarDescricao: (state, action: PayloadAction<string>) => {
      if (state.currentMonitor) state.currentMonitor.biografia = action.payload;
    },
    atualizarContato: (state, action: PayloadAction<{ telefone: string; email: string }>) => {
      if (state.currentMonitor) {
        state.currentMonitor.telefone = action.payload.telefone;
        state.currentMonitor.email = action.payload.email;
      }
    },
    atualizarMaterias: (state, action: PayloadAction<string[]>) => {
      if (state.currentMonitor) {
        state.currentMonitor.materia = action.payload;
      }
    },
    atualizarDisponibilidades: (state, action: PayloadAction<Disponibilidade[]>) => {
      if (state.currentMonitor) {
        state.currentMonitor.listaDisponibilidades = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchMonitor
      .addCase(fetchMonitor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(fetchMonitor.fulfilled, (state, action: PayloadAction<Monitor>) => {
        state.loading = false;
        state.currentMonitor = action.payload;
        state.validationErrors = {};
      })
      .addCase(fetchMonitor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Monitor não encontrado";
      })
      // updateMonitor
      .addCase(updateMonitor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.validationErrors = {};
      })
      .addCase(updateMonitor.fulfilled, (state, action: PayloadAction<Monitor>) => {
        state.loading = false;
        state.currentMonitor = action.payload;
        state.validationErrors = {};
        state.error = null;
      })
      .addCase(updateMonitor.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && 'validationErrors' in action.payload && action.payload.validationErrors) {
          state.validationErrors = action.payload.validationErrors;
        } else {
          state.error = action.payload?.message || "Erro ao atualizar monitor";
          state.validationErrors = {};
        }
      })
      // fetchDisciplinas
      .addCase(fetchDisciplinas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisciplinas.fulfilled, (state, action: PayloadAction<{ id: string; nome: string }[]>) => {
        state.loading = false;
        state.materiasDisponiveis = action.payload;
      })
      .addCase(fetchDisciplinas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Erro ao buscar disciplinas";
      });
  },
});

export const {
  validateField,
  clearValidationErrors,
  clearError,
  clearCurrentMonitor,
  atualizarDescricao,
  atualizarContato,
  atualizarMaterias,
  atualizarDisponibilidades,
} = perfilMonitorSlice.actions;

export default perfilMonitorSlice.reducer;