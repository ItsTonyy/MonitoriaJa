import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { CartaoMock, getCartoes, removeCartao } from './fetch';

// Tipo que vem do backend real (MongoDB)
export interface CartaoBackend {
  _id: string;
  usuario: string;
  numero?: string;
  titular?: string;
  validade?: string;
  cvv?: string;
  bandeira?: string;
  ultimosDigitos?: string;
}

// Tipo normalizado para o Redux (combina mock e backend)
export interface CartaoNormalizado {
  id: string; // Sempre string para compatibilidade com MongoDB _id
  numero?: string;
  titular?: string;
  nome?: string; // Para compatibilidade com mock
  bandeira?: string;
  validade?: string;
  ultimosDigitos?: string;
  usuario?: string;
}

// Adapter usando o tipo normalizado
const cartaoAdapter = createEntityAdapter<CartaoNormalizado>({
  selectId: (cartao) => cartao.id,
});

// Fetch cartões do mock (porta 3001)
export const fetchCartoes = createAsyncThunk('cartoes/fetchCartoes', async () => {
  const response = await getCartoes();
  // Normaliza os dados do mock para o formato esperado
  return response.map((c): CartaoNormalizado => ({
    id: String(c.id),
    numero: c.numero,
    nome: c.nome,
    bandeira: c.bandeira,
  }));
});

// Adicionar cartão no backend real (porta 3002)
export const adicionarCartao = createAsyncThunk(
  'cartao/adicionar',
  async (cartao: {
    numero: string;
    titular: string;
    bandeira: string;
    cvv: string;
    mes: string;
    ano: string;
    usuario: string;
  }, { rejectWithValue }) => {
    try {
      const payload = {
        numero: cartao.numero.replace(/\D/g, ""),
        titular: cartao.titular,
        bandeira: cartao.bandeira,
        cvv: cartao.cvv,
        validade: `${cartao.mes}/${cartao.ano}`,
        ultimosDigitos: cartao.numero.replace(/\D/g, "").slice(-4),
        usuario: cartao.usuario
      };

      const response = await fetch("http://localhost:3002/cartao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao criar cartão");
      }

      const data: CartaoBackend = await response.json();
      
      // Normaliza a resposta do backend para o formato do Redux
      const cartaoNormalizado: CartaoNormalizado = {
        id: data._id, // MongoDB usa _id
        numero: data.numero,
        titular: data.titular,
        bandeira: data.bandeira,
        validade: data.validade,
        ultimosDigitos: data.ultimosDigitos,
        usuario: data.usuario,
      };

      return cartaoNormalizado;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Remover cartão do mock (porta 3001)
export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (id: string) => {
    // Se for um ID numérico (mock), converte
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      await removeCartao(numericId);
    }
    // TODO: Se for MongoDB _id, chamar endpoint do backend real
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
        state.error = action.payload as string || 'Erro ao adicionar cartão';
      })
      
      // Remover cartão
      .addCase(removerCartao.fulfilled, (state, action) => {
        cartaoAdapter.removeOne(state, action.payload);
      });
  },
});

export default listaCartaoSlice.reducer;

export const { selectAll: selectAllCartoes } = cartaoAdapter.getSelectors(
  (state: any) => state.cartoes
);

// Seletor para pegar o estado de loading
export const selectCartoesLoading = (state: any) => state.cartoes.loading;

// Seletor para pegar erros
export const selectCartoesError = (state: any) => state.cartoes.error;