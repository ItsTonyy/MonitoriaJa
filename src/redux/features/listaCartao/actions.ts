import { createAsyncThunk } from '@reduxjs/toolkit';
import { Cartao, getCartoes, addCartao, removeCartao, confirmarPagamentoAPI } from './fetch';

// ✅ Buscar cartões
export const fetchCartoes = createAsyncThunk(
  'cartoes/fetchCartoes',
  async (usuarioId: number | undefined, { rejectWithValue }) => {
    try {
      return await getCartoes(usuarioId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao buscar cartões');
    }
  }
);

// ✅ Adicionar cartão
export const adicionarCartao = createAsyncThunk(
  'cartoes/adicionarCartao',
  async (novoCartao: Omit<Cartao, 'id'>, { rejectWithValue }) => {
    try {
      const response = await addCartao(novoCartao);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao cadastrar cartão');
    }
  }
);

// ✅ Remover cartão
export const removerCartao = createAsyncThunk(
  'cartoes/removerCartao',
  async (id: number, { rejectWithValue }) => {
    try {
      await removeCartao(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao remover cartão');
    }
  }
);

// ✅ Confirmar pagamento
export const confirmarPagamento = createAsyncThunk(
  'cartoes/confirmarPagamento',
  async (cartaoId: number, { rejectWithValue }) => {
    try {
      // 🔹 Simulação de processamento
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { cartaoId }; // sucesso
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao confirmar pagamento');
    }
  }
);
