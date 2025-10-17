// src/redux/features/listaCartao/actions.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Cartao, getCartoes, addCartao, removeCartao } from './fetch';

export const fetchCartoes = createAsyncThunk(
  'cartoes/fetchCartoes', 
  async (usuarioId?: number) => {
    const response = await getCartoes(usuarioId);
    return response;
  }
);

// No actions.ts - MUDAR para:
// Nos actions.ts, adicionar rejectWithValue
export const adicionarCartao = createAsyncThunk(
  'cartoes/adicionarCartao',
  async (novoCartao: Omit<Cartao, 'id'>, { rejectWithValue }) => {
    try {
      const response = await addCartao(novoCartao);
      return response;
    } catch (error) {
      return rejectWithValue('Erro ao cadastrar cartão');
    }
  }
);

export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (id: number) => {
    await removeCartao(id);
    return id;
  }
);