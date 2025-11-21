// src/store/listaCartaoSlice.ts
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

// Configure a URL base da sua API
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';

// Rota correta (singular)
const CARTAO_ENDPOINT = `${API_BASE_URL}/cartao`;

// Tipo para o cartão retornado pela API (com id obrigatório)
export type Cartao = {
  id: string;
  usuario: string;
  numero?: string;
  titular?: string;
  validade?: string;
  cvv?: string;
  bandeira?: "Visa" | "MasterCard" | "Elo";
  ultimosDigitos?: string;
};

// Tipo para criar um novo cartão (sem id, usuário será preenchido automaticamente)
export type NovoCartao = {
  numero: string;
  titular: string;
  validade: string;
  cvv: string;
  bandeira: string;
  ultimosDigitos: string;
};

const cartaoAdapter = createEntityAdapter<Cartao>();

// Thunk para buscar cartões do usuário logado
export const fetchCartoes = createAsyncThunk(
  'cartoes/fetchCartoes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Usuário não autenticado');
      }

      const response = await fetch(`${CARTAO_ENDPOINT}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue('Token expirado ou inválido');
        }
        const errorText = await response.text();
        return rejectWithValue(errorText || `Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Já vem com id do backend
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido ao buscar cartões');
    }
  }
);

// Thunk para adicionar cartão (será vinculado ao usuário logado automaticamente)
export const adicionarCartao = createAsyncThunk(
  'cartoes/adicionarCartao',
  async (novoCartao: NovoCartao, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Usuário não autenticado');
      }

      const response = await fetch(`${CARTAO_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoCartao),
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.erro || errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        return rejectWithValue(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        return rejectWithValue('Resposta do servidor inválida');
      }
      
      return {
        ...data,
        id: data.id,
      } as Cartao;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido ao adicionar cartão');
    }
  }
);

// Thunk para remover cartão
export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return rejectWithValue('Usuário não autenticado');
      }

      const response = await fetch(`${CARTAO_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return rejectWithValue('Cartão não encontrado');
        }
        if (response.status === 403) {
          return rejectWithValue('Você não tem permissão para remover este cartão');
        }
        const errorText = await response.text();
        return rejectWithValue(errorText || `Erro ${response.status}: ${response.statusText}`);
      }

      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Erro desconhecido ao remover cartão');
    }
  }
);

const listaCartaoSlice = createSlice({
  name: 'cartoes',
  initialState: cartaoAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cartões
      .addCase(fetchCartoes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartoes.fulfilled, (state, action) => {
        state.loading = false;
        cartaoAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCartoes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Erro ao buscar cartões';
      })
      // Adicionar cartão
      .addCase(adicionarCartao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adicionarCartao.fulfilled, (state, action) => {
        state.loading = false;
        cartaoAdapter.addOne(state, action.payload);
      })
      .addCase(adicionarCartao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Erro ao adicionar cartão';
      })
      // Remover cartão
      .addCase(removerCartao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removerCartao.fulfilled, (state, action) => {
        state.loading = false;
        cartaoAdapter.removeOne(state, action.payload);
      })
      .addCase(removerCartao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Erro ao remover cartão';
      });
  },
});

export const { clearError } = listaCartaoSlice.actions;
export default listaCartaoSlice.reducer;

// Exporta seletores prontos do entity adapter
export const { selectAll: selectAllCartoes } = cartaoAdapter.getSelectors(
  (state: any) => state.cartoes
);