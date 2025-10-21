// redux/features/cartoesSlice.ts
import { createSlice, createEntityAdapter, EntityState, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../root-reducer';

/* -------------------- Tipos -------------------- */
export type Cartao = {
  id: number;
  numero: string;
  nome: string;
  bandeira: 'Visa' | 'MasterCard' | 'Elo';
  usuarioId: number;
};

export interface FormData {
  numero: string;
  nome: string;
  bandeira: string;
  cpf: string;
  cvv: string;
  mes: string;
  ano: string;
}

export interface PagamentoTemp {
  valor: number;
  cartaoId: number | null;
}

interface CartoesState extends EntityState<Cartao, number> {
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  operacao: 'fetch' | 'add' | 'remove' | 'confirmar' | null;
  formData: FormData;
  pagamentoTemp: PagamentoTemp;
}

/* -------------------- Adapter e Estado Inicial -------------------- */
const cartoesAdapter = createEntityAdapter<Cartao>();

const initialState: CartoesState = cartoesAdapter.getInitialState({
  status: 'idle',
  errorMessage: null,
  operacao: null,
  formData: {
    numero: '',
    nome: '',
    bandeira: '',
    cpf: '',
    cvv: '',
    mes: '',
    ano: '',
  },
  pagamentoTemp: {
    valor: 0,
    cartaoId: null,
  },
});

/* -------------------- Funções de API -------------------- */
const API_URL = 'http://localhost:3001/cartoes';

const getCartoes = async (usuarioId?: number): Promise<Cartao[]> => {
  const url = usuarioId ? `${API_URL}?usuarioId=${usuarioId}` : API_URL;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar cartões');
  return await response.json();
};

const addCartao = async (novoCartao: Omit<Cartao, 'id'>): Promise<Cartao> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoCartao),
  });
  if (!response.ok) throw new Error('Erro ao cadastrar cartão');
  return await response.json();
};

const removeCartao = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao remover cartão');
};

const confirmaPagamentoAPI = async (cartaoId: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 1500)); // simula processamento
  if (Math.random() < 0.2) throw new Error('Falha ao processar pagamento'); // erro aleatório
};

/* -------------------- Async Thunks -------------------- */
export const fetchCartoes = createAsyncThunk<Cartao[], number | undefined, { rejectValue: string }>(
  'cartoes/fetchCartoes',
  async (usuarioId, { rejectWithValue }) => {
    try {
      return await getCartoes(usuarioId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar cartões');
    }
  }
);

export const adicionarCartao = createAsyncThunk<Cartao, Omit<Cartao, 'id'>, { rejectValue: string }>(
  'cartoes/adicionarCartao',
  async (novoCartao, { rejectWithValue }) => {
    try {
      return await addCartao(novoCartao);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao cadastrar cartão');
    }
  }
);

export const removerCartao = createAsyncThunk<number, number, { rejectValue: string }>(
  'cartoes/removerCartao',
  async (id, { rejectWithValue }) => {
    try {
      await removeCartao(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao remover cartão');
    }
  }
);

export const confirmaPagamento = createAsyncThunk<{ cartaoId: number }, number, { rejectValue: string }>(
  'cartoes/confirmaPagamento',
  async (cartaoId, { rejectWithValue }) => {
    try {
      await confirmaPagamentoAPI(cartaoId);
      return { cartaoId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao confirmar pagamento');
    }
  }
);

/* -------------------- Slice -------------------- */
const cartoesSlice = createSlice({
  name: 'cartoes',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.errorMessage = null;
      state.operacao = null;
    },
    resetPagamentoTemp: (state) => {
      state.pagamentoTemp = { valor: 0, cartaoId: null };
    },
    setPagamentoTemp: (state, action: PayloadAction<PagamentoTemp>) => {
      state.pagamentoTemp = action.payload;
    },
    setFormData: (state, action: PayloadAction<{ field: keyof FormData; value: string }>) => {
      state.formData[action.payload.field] = action.payload.value;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
    },
    setFormDataBulk: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    /* Fetch */
    builder.addCase(fetchCartoes.pending, (state) => {
      state.status = 'loading';
      state.errorMessage = null;
      state.operacao = 'fetch';
    });
    builder.addCase(fetchCartoes.fulfilled, (state, action) => {
      state.status = 'success';
      state.operacao = null;
      cartoesAdapter.setAll(state, action.payload);
    });
    builder.addCase(fetchCartoes.rejected, (state, action) => {
      state.status = 'error';
      state.errorMessage = action.payload || 'Erro ao carregar cartões';
      state.operacao = null;
    });

    /* Add */
    builder.addCase(adicionarCartao.pending, (state) => {
      state.status = 'loading';
      state.errorMessage = null;
      state.operacao = 'add';
    });
    builder.addCase(adicionarCartao.fulfilled, (state, action) => {
      state.status = 'success';
      state.operacao = null;
      cartoesAdapter.addOne(state, action.payload);
      state.formData = initialState.formData;
    });
    builder.addCase(adicionarCartao.rejected, (state, action) => {
      state.status = 'error';
      state.errorMessage = action.payload || 'Erro ao cadastrar cartão';
      state.operacao = null;
    });

    /* Remove */
    builder.addCase(removerCartao.pending, (state) => {
      state.status = 'loading';
      state.errorMessage = null;
      state.operacao = 'remove';
    });
    builder.addCase(removerCartao.fulfilled, (state, action) => {
      state.status = 'success';
      state.operacao = null;
      cartoesAdapter.removeOne(state, action.payload);
    });
    builder.addCase(removerCartao.rejected, (state, action) => {
      state.status = 'error';
      state.errorMessage = action.payload || 'Erro ao remover cartão';
      state.operacao = null;
    });

    /* Confirmar Pagamento */
    builder.addCase(confirmaPagamento.pending, (state) => {
      state.status = 'loading';
      state.errorMessage = null;
      state.operacao = 'confirmar';
    });
    builder.addCase(confirmaPagamento.fulfilled, (state) => {
      state.status = 'success';
      state.operacao = null;
    });
    builder.addCase(confirmaPagamento.rejected, (state, action) => {
      state.status = 'error';
      state.errorMessage = action.payload || 'Erro ao processar pagamento';
      state.operacao = null;
    });
  },
});

/* -------------------- Exports -------------------- */
export const { resetStatus, resetPagamentoTemp, setPagamentoTemp, setFormData, resetForm, setFormDataBulk } = cartoesSlice.actions;

export const { selectAll: selectAllCartoes, selectById: selectCartaoById } = cartoesAdapter.getSelectors(
  (state: RootState) => state.cartoes
);

export const selectPagamentoTemp = (state: RootState) => state.cartoes.pagamentoTemp;
export const selectFormData = (state: RootState) => state.cartoes.formData;

export default cartoesSlice.reducer;
