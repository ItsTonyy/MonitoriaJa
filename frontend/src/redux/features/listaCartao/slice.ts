import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserIdFromToken } from '../../../pages/Pagamento/Cartao/CadastraCartao/authUtils';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
const CARTAO_ENDPOINT = `${API_BASE_URL}/cartao`;

export type Cartao = {
  _id: string;
  usuario: string | { _id?: string; nome?: string; email?: string };
  numero: string;
  titular: string;
  validade: string;
  cvv?: string;
  bandeira?: "Visa" | "MasterCard" | "Elo" | string;
  ultimosDigitos: string;
  [key: string]: any;
};

export type NovoCartao = {
  usuario?: string;
  numero: string;
  titular: string;
  validade: string;
  cvv: string;
  bandeira?: string;
  ultimosDigitos: string;
};

interface CartoesState {
  items: Cartao[];
  loading: boolean;
  error: null | string;
}

const initialState: CartoesState = {
  items: [],
  loading: false,
  error: null,
};

/**
 * Busca os cartões do usuário logado
 * GET /cartao/meus-cartoes/:id
 */
export const fetchCartoes = createAsyncThunk(
  'cartoes/fetchCartoes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!userId) {
        return rejectWithValue('Usuário não autenticado');
      }

      const response = await fetch(`${CARTAO_ENDPOINT}/meus-cartoes/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errMsg = `Erro ${response.status}`;
        try {
          const body = await response.json();
          if (body && (body.erro || body.message)) {
            errMsg = body.erro || body.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Erro ao buscar cartões');
      }
    }
  }
);

/**
 * Busca TODOS os cartões do banco (admin/monitor)
 * GET /cartao
 */
export const fetchTodosCartoes = createAsyncThunk(
  'cartoes/fetchTodosCartoes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      console.log('🔍 fetchTodosCartoes - Iniciando requisição');
      console.log('📍 URL COMPLETA:', CARTAO_ENDPOINT);
      console.log('📍 API_BASE_URL:', API_BASE_URL);
      console.log('🔑 Token presente:', !!token);

      if (!token) {
        return rejectWithValue('Usuário não autenticado');
      }

      // Decodifica o token para debug
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('👤 Token payload:', payload);
        console.log('🎭 Role no token:', payload.role);
      } catch (e) {
        console.log('⚠️ Não foi possível decodificar token para debug');
      }

      const response = await fetch(CARTAO_ENDPOINT, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Status da resposta:', response.status);
      console.log('✅ Response OK:', response.ok);
      console.log('📋 Headers da resposta:', {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length')
      });

      if (!response.ok) {
        let errMsg = `Erro ${response.status}`;
        try {
          const body = await response.json();
          console.log('❌ Erro do servidor:', body);
          if (body && (body.erro || body.message)) {
            errMsg = body.erro || body.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      console.log('✅ Dados recebidos (primeiros 3 itens):', data.slice(0, 3));
      console.log('📦 Total de cartões retornados:', Array.isArray(data) ? data.length : 1);
      
      if (Array.isArray(data)) {
        // Mostra IDs únicos de usuários
        const usuariosUnicos = new Set(data.map(c => {
          if (typeof c.usuario === 'string') return c.usuario;
          return c.usuario?._id || 'sem-id';
        }));
        console.log('👥 Total de usuários únicos:', usuariosUnicos.size);
        console.log('👥 IDs de usuários:', Array.from(usuariosUnicos));
      }
      
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      console.error('❌ Erro na requisição:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Erro ao buscar todos os cartões');
      }
    }
  }
);

/**
 * Adiciona um novo cartão
 * POST /cartao/:id
 */
export const adicionarCartao = createAsyncThunk(
  'cartoes/adicionarCartao',
  async (novoCartao: NovoCartao, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!userId) {
        return rejectWithValue('Usuário não autenticado');
      }

      const response = await fetch(`${CARTAO_ENDPOINT}/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoCartao),
      });

      if (!response.ok) {
        let errMsg = `Erro ${response.status}`;
        try {
          const body = await response.json();
          if (body && (body.erro || body.message)) {
            errMsg = body.erro || body.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Erro ao adicionar cartão');
      }
    }
  }
);

/**
 * Remove cartão por id
 * DELETE /cartao/:id
 */
export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (cartaoId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!token || !userId) {
        return rejectWithValue('Usuário não autenticado');
      }

      const response = await fetch(`${CARTAO_ENDPOINT}/${userId}?cartaoId=${cartaoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errMsg = `Erro ${response.status}`;
        try {
          const body = await response.json();
          if (body && (body.erro || body.message)) {
            errMsg = body.erro || body.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      return cartaoId;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Erro ao remover cartão');
      }
    }
  }
);

/**
 * Atualiza cartão por id
 * PATCH /cartao/:id
 */
export const atualizarCartao = createAsyncThunk(
  'cartoes/atualizarCartao',
  async ({ id, updates }: { id: string; updates: Partial<Cartao> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = getUserIdFromToken();

      if (!token || !userId) {
        return rejectWithValue('Usuário não autenticado');
      }

      const response = await fetch(`${CARTAO_ENDPOINT}/${userId}?cartaoId=${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        let errMsg = `Erro ${response.status}`;
        try {
          const body = await response.json();
          if (body && (body.erro || body.message)) {
            errMsg = body.erro || body.message;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      const data = await response.json();
      return { id, updates: data };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Erro ao atualizar cartão');
      }
    }
  }
);

const listaCartaoSlice = createSlice({
  name: 'cartoes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCartoes: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
    setCartoes: (state, action) => {
      state.items = action.payload;
    },
    addCartao: (state, action) => {
      state.items.push(action.payload);
    },
    removeCartao: (state, action) => {
      state.items = state.items.filter(cartao => cartao._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH CARTOES (usuário)
      .addCase(fetchCartoes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartoes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCartoes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // FETCH TODOS CARTOES (admin/monitor)
      .addCase(fetchTodosCartoes.pending, (state) => {
        console.log('⏳ Redux: fetchTodosCartoes.pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosCartoes.fulfilled, (state, action) => {
        console.log('✅ Redux: fetchTodosCartoes.fulfilled', action.payload);
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodosCartoes.rejected, (state, action) => {
        console.log('❌ Redux: fetchTodosCartoes.rejected', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })

      // ADD CARTAO
      .addCase(adicionarCartao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adicionarCartao.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        if (payload && payload._id) {
          state.items.push(payload);
        } else if (payload && payload.cartao) {
          state.items.push(payload.cartao);
        }
      })
      .addCase(adicionarCartao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REMOVE CARTAO
      .addCase(removerCartao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removerCartao.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload as string;
        state.items = state.items.filter((c) => c._id !== id);
      })
      .addCase(removerCartao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // UPDATE CARTAO
      .addCase(atualizarCartao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(atualizarCartao.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const index = state.items.findIndex(cartao => cartao._id === id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...updates };
        }
      })
      .addCase(atualizarCartao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  clearError, 
  clearCartoes, 
  setCartoes, 
  addCartao, 
  removeCartao 
} = listaCartaoSlice.actions;

export default listaCartaoSlice.reducer;

// Selectors
export const selectAllCartoes = (state: any) => state.cartoes.items;
export const selectCartoesLoading = (state: any) => state.cartoes.loading;
export const selectCartoesError = (state: any) => state.cartoes.error;
export const selectCartaoById = (state: any, cartaoId: string) => 
  state.cartoes.items.find((cartao: Cartao) => cartao._id === cartaoId);
export const selectCartoesCount = (state: any) => state.cartoes.items.length;