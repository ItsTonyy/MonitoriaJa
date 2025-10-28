// src/store/listaCartaoSlice.ts
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { Cartao, getCartoes, addCartao, removeCartao } from './fetch';

const cartaoAdapter = createEntityAdapter<Cartao>();


export const fetchCartoes = createAsyncThunk('cartoes/fetchCartoes', async () => {
  const response = await getCartoes();
  return response;
});

export const adicionarCartao = createAsyncThunk(
  'cartoes/adicionarCartao',
  async (novoCartao: Omit<Cartao, 'id'>) => {
    const response = await addCartao(novoCartao);
    return response;
  }
);

export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (id: number) => {
    await removeCartao(id);
    return id;
  }
);

const listaCartaoSlice = createSlice({
  name: 'cartoes',
  initialState: cartaoAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCartoes.fulfilled, (state, action) => {
      cartaoAdapter.setAll(state, action.payload);
    });
    builder.addCase(adicionarCartao.fulfilled, (state, action) => {
      cartaoAdapter.addOne(state, action.payload);
    });
    builder.addCase(removerCartao.fulfilled, (state, action) => {
      cartaoAdapter.removeOne(state, action.payload);
    });
  },
});

export default listaCartaoSlice.reducer;

// Exporta seletores prontos do entity adapter
export const { selectAll: selectAllCartoes } = cartaoAdapter.getSelectors(
  (state: any) => state.cartoes
);