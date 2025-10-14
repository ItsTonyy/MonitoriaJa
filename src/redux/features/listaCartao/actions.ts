// src/store/listaCartaoActions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Cartao, getCartoes, addCartao, removeCartao } from './fetch';

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