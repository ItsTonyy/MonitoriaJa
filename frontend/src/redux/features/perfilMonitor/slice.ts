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
  listaDisciplinas?: string[]; // IDs das disciplinas associadas
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
      console.log('📚 [fetchDisciplinas] Buscando disciplinas...');
      
      const response = await fetch("http://localhost:3001/disciplina", {
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` }),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error("Erro ao buscar disciplinas");
      
      const data = await response.json();
      console.log('✅ [fetchDisciplinas] Disciplinas carregadas (RAW):', data);
      
      // Mapear corretamente os IDs - o MongoDB usa _id
      const disciplinasMapeadas = data.map((disciplina: any) => ({
        id: disciplina._id || disciplina.id,
        nome: disciplina.nome
      }));
      
      console.log('✅ [fetchDisciplinas] Disciplinas mapeadas:', disciplinasMapeadas);
      return disciplinasMapeadas;
    } catch (err: any) {
      console.error('❌ [fetchDisciplinas] Erro:', err);
      return rejectWithValue(err.message || "Erro ao buscar disciplinas");
    }
  }
);

// AsyncThunk: buscar monitor pelo id - LÓGICA CORRIGIDA
export const fetchMonitor = createAsyncThunk<
  Monitor,
  string | undefined,
  { rejectValue: string }
>(
  "perfilMonitor/fetchMonitor",
  async (monitorId, { rejectWithValue }) => {
    try {
      const token = getToken();
      
      if (!token || isTokenExpired()) {
        return rejectWithValue("Token inválido ou expirado. Faça login novamente.");
      }

      const targetMonitorId = monitorId || getUserIdFromToken();
      
      if (!targetMonitorId) {
        return rejectWithValue("ID do monitor não encontrado");
      }

      const url = `http://localhost:3001/usuario/${targetMonitorId}`;
      console.log('🌐 [fetchMonitor] Fazendo requisição para:', url);

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 [fetchMonitor] Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ [fetchMonitor] Erro na resposta:', errorText);
        
        if (response.status === 404) {
          return rejectWithValue("Monitor não encontrado");
        }
        if (response.status === 401) {
          return rejectWithValue("Não autorizado. Faça login novamente.");
        }
        throw new Error("Erro ao buscar monitor");
      }

      const user = await response.json();
      console.log('✅ [fetchMonitor] Dados recebidos do backend:', user);

      // ANÁLISE DA LÓGICA:
      // O backend retorna listaDisciplinas como array de NOMES devido ao populate
      // Mas para atualizar, precisamos enviar IDs
      // Solução: Manter os nomes para exibição e mapear para IDs quando necessário

      let materiasNomes: string[] = [];
      let listaDisciplinasIds: string[] = []; // Não temos os IDs aqui, só os nomes

      if (user.listaDisciplinas && Array.isArray(user.listaDisciplinas)) {
        if (user.listaDisciplinas.length > 0) {
          if (typeof user.listaDisciplinas[0] === 'string') {
            // Backend retornou nomes (devido ao populate)
            materiasNomes = user.listaDisciplinas;
            console.log('📚 [fetchMonitor] Matérias recebidas como nomes:', materiasNomes);
            // Não temos os IDs aqui - serão mapeados posteriormente quando necessário
          } else if (typeof user.listaDisciplinas[0] === 'object') {
            // Se por acaso vier como objetos (fallback)
            materiasNomes = user.listaDisciplinas.map((disciplina: any) => disciplina.nome);
            listaDisciplinasIds = user.listaDisciplinas.map((disciplina: any) => disciplina._id || disciplina.id);
            console.log('📚 [fetchMonitor] Matérias extraídas de objetos:', materiasNomes);
            console.log('🆔 [fetchMonitor] IDs extraídos de objetos:', listaDisciplinasIds);
          }
        }
      }
      
      // Fallback para materia antigo
      if (materiasNomes.length === 0 && user.materia) {
        console.log('🔄 [fetchMonitor] Usando fallback para campo materia antigo');
        if (Array.isArray(user.materia)) {
          materiasNomes = user.materia;
        } else if (typeof user.materia === 'string') {
          materiasNomes = [user.materia];
        }
      }

      const monitorData = {
        id: user.id || user._id,
        nome: user.nome || user.name || '',
        email: user.email || '',
        telefone: user.telefone || user.phone || '',
        tipoUsuario: user.tipoUsuario || 'MONITOR',
        biografia: user.biografia || user.description || '',
        materia: materiasNomes, // Para exibição na UI
        listaDisciplinas: listaDisciplinasIds, // IDs (se disponíveis) - geralmente vazio devido ao populate
        foto: user.foto || user.fotoUrl || user.photo || '',
        avaliacao: user.avaliacao || 0,
        formacao: user.formacao || '',
        listaDisponibilidades: user.listaDisponibilidades || user.disponibilidades || [],
      };

      console.log('🎯 [fetchMonitor] Monitor processado:', monitorData);
      return monitorData;
    } catch (error: any) {
      console.error('💥 [fetchMonitor] Erro no catch:', error);
      return rejectWithValue(error.message || "Erro ao carregar monitor");
    }
  }
);

// AsyncThunk: atualizar monitor - LÓGICA CORRIGIDA
export const updateMonitor = createAsyncThunk<
  Monitor,
  {
    nome: string;
    telefone: string;
    email: string;
    biografia?: string;
    materia?: string[]; // Nomes das matérias
    fotoUrl?: string;
    listaDisponibilidades?: Disponibilidade[];
  },
  { rejectValue: { validationErrors?: ValidationErrors; message?: string } }
>(
  "perfilMonitor/updateMonitor",
  async (updateData, { getState, rejectWithValue }) => {
    console.log('🔄 [updateMonitor] Iniciando updateMonitor com dados:', updateData);
    
    try {
      // Validações
      const errors: ValidationErrors = {};
      errors.nome = validateMonitorField('nome', updateData.nome);
      errors.telefone = validateMonitorField('telefone', updateData.telefone);
      errors.email = validateMonitorField('email', updateData.email);
      if (updateData.biografia) {
        errors.descricao = validateMonitorField('descricao', updateData.biografia);
      }

      Object.keys(errors).forEach(key => {
        if (errors[key as keyof ValidationErrors] === undefined) {
          delete errors[key as keyof ValidationErrors];
        }
      });

      if (Object.keys(errors).length > 0) {
        return rejectWithValue({ validationErrors: errors });
      }

      const token = getToken();
      if (!token || isTokenExpired()) {
        return rejectWithValue({ message: "Token inválido ou expirado. Faça login novamente." });
      }

      const state = getState() as any;
      const currentMonitor: Monitor | null = state.perfilMonitor?.currentMonitor;

      if (!currentMonitor || !currentMonitor.id) {
        return rejectWithValue({ message: "Monitor não encontrado no estado. Recarregue a página." });
      }

      console.log('👤 [updateMonitor] Atualizando monitor:', currentMonitor.id);

      // Prepara o body da requisição para o backend
      const requestBody: any = {
        nome: updateData.nome,
        email: updateData.email,
        telefone: updateData.telefone,
      };

      if (updateData.biografia) requestBody.biografia = updateData.biografia;
      if (updateData.fotoUrl) requestBody.foto = updateData.fotoUrl;
      if (updateData.listaDisponibilidades) requestBody.listaDisponibilidades = updateData.listaDisponibilidades;

      // LÓGICA CRÍTICA CORRIGIDA:
      // O backend espera IDs em listaDisciplinas, mas recebemos nomes da UI
      // Precisamos converter nomes para IDs usando as disciplinas disponíveis
      if (updateData.materia && updateData.materia.length > 0) {
        const disciplinasState = state.perfilMonitor?.materiasDisponiveis || [];
        console.log('📋 [updateMonitor] Disciplinas disponíveis para mapeamento:', disciplinasState);
        
        // Mapear nomes para IDs
        const disciplinasIds = updateData.materia.map(materiaNome => {
          const disciplina = disciplinasState.find((d: any) => d.nome === materiaNome);
          if (!disciplina) {
            console.warn(`❌ [updateMonitor] Disciplina não encontrada: ${materiaNome}`);
            return null;
          }
          console.log(`✅ [updateMonitor] Mapeando: ${materiaNome} -> ${disciplina.id}`);
          return disciplina.id;
        }).filter(Boolean); // Remove null/undefined

        console.log('📚 [updateMonitor] Matérias selecionadas (nomes):', updateData.materia);
        console.log('🆔 [updateMonitor] IDs mapeados para envio:', disciplinasIds);
        
        if (disciplinasIds.length > 0) {
          requestBody.listaDisciplinas = disciplinasIds;
          console.log('✅ [updateMonitor] listaDisciplinas enviada (IDs):', disciplinasIds);
        } else {
          requestBody.listaDisciplinas = [];
          console.warn('⚠️ [updateMonitor] Nenhum ID mapeado, enviando array vazio');
        }
      } else {
        requestBody.listaDisciplinas = [];
        console.log('📭 [updateMonitor] Nenhuma matéria selecionada, enviando listaDisciplinas vazia');
      }

      console.log('📝 [updateMonitor] Dados enviados para atualização:');
      console.log(JSON.stringify(requestBody, null, 2));

      const url = `http://localhost:3001/usuario/${currentMonitor.id}`;
      console.log('🌐 [updateMonitor] Fazendo PATCH para:', url);

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 [updateMonitor] Status da resposta:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ [updateMonitor] Erro na resposta:', errorText);
        
        if (response.status === 401) {
          return rejectWithValue({ message: "Não autorizado. Faça login novamente." });
        }
        if (response.status === 400) {
          return rejectWithValue({ message: errorText || "Dados inválidos" });
        }
        throw new Error(`Erro ao atualizar monitor: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ [updateMonitor] Resposta do servidor:', result);

      // Atualiza o monitor no estado
      const updatedMonitor: Monitor = {
        ...currentMonitor,
        nome: updateData.nome,
        email: updateData.email,
        telefone: updateData.telefone,
        biografia: updateData.biografia !== undefined ? updateData.biografia : currentMonitor.biografia,
        materia: updateData.materia !== undefined ? updateData.materia : currentMonitor.materia,
        foto: updateData.fotoUrl !== undefined ? updateData.fotoUrl : currentMonitor.foto,
        listaDisponibilidades: updateData.listaDisponibilidades !== undefined ? updateData.listaDisponibilidades : currentMonitor.listaDisponibilidades,
        // Não atualizamos listaDisciplinas aqui pois o backend retorna nomes devido ao populate
      };

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
      console.error('💥 [updateMonitor] Erro no catch:', error);
      return rejectWithValue({ message: error.message || "Erro ao atualizar monitor" });
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