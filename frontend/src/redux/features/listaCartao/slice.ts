// src/store/listaCartaoSlice.ts
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';

// Configure a URL base da sua API
const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:3001';

// Rota correta (singular)
const CARTAO_ENDPOINT = `${API_BASE_URL}/cartao`;

// Tipo para o cartão retornado pela API (com id obrigatório)
export type Cartao = {
  id: string;
  usuario?: string;
  numero?: string;
  titular?: string;
  validade?: string;
  cvv?: string;
  bandeira?: "Visa" | "MasterCard" | "Elo";
  ultimosDigitos?: string;
};

// Tipo para criar um novo cartão (sem id)
export type NovoCartao = {
  usuario: string;
  numero: string;
  titular: string;
  validade: string;
  cvv: string;
  bandeira: string;
  ultimosDigitos: string;
};

const cartaoAdapter = createEntityAdapter<Cartao>();

// Thunk para buscar todos os cartões
export const fetchCartoes = createAsyncThunk(
  'cartoes/fetchCartoes',
  async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${CARTAO_ENDPOINT}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Mapeia _id do MongoDB para id
    const cartoes = data.map((cartao: any) => ({
      ...cartao,
      id: cartao._id || cartao.id,
    }));
    
    return cartoes as Cartao[];
  }
);

// Thunk para adicionar cartão (integração real com backend)
export const adicionarCartao = createAsyncThunk(
  'cartoes/adicionarCartao',
  async (novoCartao: NovoCartao) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${CARTAO_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
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
      throw new Error(errorMessage);
    }

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Se não retornar JSON, busca todos os cartões
      const cartoesResponse = await fetch(`${CARTAO_ENDPOINT}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      const cartoes = await cartoesResponse.json();
      const ultimoCartao = cartoes[cartoes.length - 1];
      return {
        ...ultimoCartao,
        id: ultimoCartao._id || ultimoCartao.id,
      } as Cartao;
    }
    
    // Se a API retornar apenas uma mensagem, busca o cartão novamente
    if (data.message && !data._id && !data.id) {
      const cartoesResponse = await fetch(`${CARTAO_ENDPOINT}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });
      const cartoes = await cartoesResponse.json();
      const ultimoCartao = cartoes[cartoes.length - 1];
      return {
        ...ultimoCartao,
        id: ultimoCartao._id || ultimoCartao.id,
      } as Cartao;
    }
    
    return {
      ...data,
      id: data._id || data.id,
    } as Cartao;
  }
);

// Thunk para remover cartão
export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (id: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${CARTAO_ENDPOINT}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Erro ${response.status}: ${response.statusText}`);
    }

    return id;
  }
);

const listaCartaoSlice = createSlice({
  name: 'cartoes',
  initialState: cartaoAdapter.getInitialState({
    loading: false,
    error: null as string | null,
  }),
  reducers: {},
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
        state.error = action.error.message || 'Erro ao buscar cartões';
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
        state.error = action.error.message || 'Erro ao adicionar cartão';
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
        state.error = action.error.message || 'Erro ao remover cartão';
      });
  },
});

export default listaCartaoSlice.reducer;

// Exporta seletores prontos do entity adapter
export const { selectAll: selectAllCartoes } = cartaoAdapter.getSelectors(
  (state: any) => state.cartoes
);