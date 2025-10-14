// src/store/listaCartaoSlice.ts
import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';
import { Cartao } from './fetch';
import { fetchCartoes, adicionarCartao, removerCartao } from './actions';

const cartaoAdapter = createEntityAdapter<Cartao>();

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