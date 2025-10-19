import { createSlice, createEntityAdapter, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { Cartao } from './fetch';
import { fetchCartoes, adicionarCartao, removerCartao, confirmarPagamento } from './actions';
import { RootState } from '../../root-reducer';

// ✅ Entity Adapter para gerenciar lista de cartões
const cartoesAdapter = createEntityAdapter<Cartao>();

// ✅ Interface para dados do formulário
export interface FormData {
  numero: string;
  nome: string;
  bandeira: string;
  cpf: string;
  cvv: string;
  mes: string;
  ano: string;
}

interface CartoesState extends EntityState<Cartao, number> {
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
  operacao: 'fetch' | 'add' | 'remove' | 'confirmar' | null;
  formData: FormData;
}

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
});

const cartoesSlice = createSlice({
  name: 'cartoes',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = 'idle';
      state.errorMessage = null;
      state.operacao = null;
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
    // ✅ Buscar cartões
    builder
      .addCase(fetchCartoes.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
        state.operacao = 'fetch';
      })
      .addCase(fetchCartoes.fulfilled, (state, action) => {
        state.status = 'success';
        state.operacao = null;
        cartoesAdapter.setAll(state, action.payload);
      })
      .addCase(fetchCartoes.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload as string || 'Erro ao carregar cartões';
        state.operacao = null;
      });

    // ✅ Adicionar cartão
    builder
      .addCase(adicionarCartao.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
        state.operacao = 'add';
      })
      .addCase(adicionarCartao.fulfilled, (state, action) => {
        state.status = 'success';
        state.operacao = null;
        cartoesAdapter.addOne(state, action.payload);
        state.formData = initialState.formData;
      })
      .addCase(adicionarCartao.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload as string || 'Erro ao cadastrar cartão';
        state.operacao = null;
      });

    // ✅ Remover cartão
    builder
      .addCase(removerCartao.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
        state.operacao = 'remove';
      })
      .addCase(removerCartao.fulfilled, (state, action) => {
        state.status = 'success';
        state.operacao = null;
        cartoesAdapter.removeOne(state, action.payload);
      })
      .addCase(removerCartao.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage = action.payload as string || 'Erro ao remover cartão';
        state.operacao = null;
      });

    // ✅ Confirmar pagamento
// Confirmar pagamento
builder
  .addCase(confirmarPagamento.pending, (state) => {
    state.status = 'loading';
    state.errorMessage = null;
    state.operacao = 'add'; // ou 'payment', só para controle
  })
  .addCase(confirmarPagamento.fulfilled, (state) => {
    state.status = 'success';
    state.operacao = null;
  })
  .addCase(confirmarPagamento.rejected, (state, action) => {
    state.status = 'error';
    state.errorMessage = action.payload as string || 'Erro ao processar pagamento';
    state.operacao = null;
  });

  },
});

export const { resetStatus, setFormData, resetForm, setFormDataBulk } = cartoesSlice.actions;

export const {
  selectAll: selectAllCartoes,
  selectById: selectCartaoById,
  selectIds: selectCartaoIds,
} = cartoesAdapter.getSelectors((state: RootState) => state.cartoes);

export const selectFormData = (state: RootState) => state.cartoes.formData;

export default cartoesSlice.reducer;
