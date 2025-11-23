import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';
const CARTAO_ENDPOINT = `${API_BASE_URL}/cartao`;

export type Cartao = {
  _id: string;
  usuario: string | { _id?: string; nome?: string; email?: string } ;
  numero: string;
  titular: string;
  validade: string;
  cvv?: string;
  bandeira?: "Visa" | "MasterCard" | "Elo" | string;
  ultimosDigitos: string;
  [key: string]: any;
};

export type NovoCartao = {
  usuario?: string; // opcional no front; backend deve validar com token
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
 * Busca os cartões do usuário logado.
 * Usa a rota: GET /cartao/meus-cartoes
 */
// redux/features/listaCartao/slice.ts
// redux/features/listaCartao/slice.ts

// redux/features/listaCartao/slice.ts
export const fetchCartoes = createAsyncThunk(
  'cartoes/fetchCartoes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${CARTAO_ENDPOINT}/meus-cartoes`, {
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
        } catch (parseError) {
          // Silencioso em produção
        }
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

export const adicionarCartao = createAsyncThunk(
  'cartoes/adicionarCartao',
  async (novoCartao: NovoCartao, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(CARTAO_ENDPOINT, {
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
      // CORREÇÃO: Verificar o tipo do erro
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Erro ao adicionar cartão');
      }
    }
  }
);

export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${CARTAO_ENDPOINT}/${id}`, {
        method: 'DELETE',
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

      return id;
    } catch (error) {
      // CORREÇÃO: Verificar o tipo do erro
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue('Erro ao remover cartão');
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
    // opcional: limpar lista (útil no logout)
    clearCartoes: (state) => {
      state.items = [];
      state.error = null;
      state.loading = false;
    },
    // opcional: set manual de cartoes (útil para testes)
    setCartoes: (state, action) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
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

      // ADD
      .addCase(adicionarCartao.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adicionarCartao.fulfilled, (state, action) => {
        state.loading = false;
        // se backend retornar objeto criado, tenta adicionar. se só message, não faz push.
        const payload = action.payload as any;
        if (payload && payload._id) {
          state.items.push(payload);
        }
      })
      .addCase(adicionarCartao.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REMOVE
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
      });
  },
});

export const { clearError, clearCartoes, setCartoes } = listaCartaoSlice.actions;
export default listaCartaoSlice.reducer;

export const selectAllCartoes = (state: any) => state.cartoes.items;
export const selectCartoesLoading = (state: any) => state.cartoes.loading;
export const selectCartoesError = (state: any) => state.cartoes.error;
