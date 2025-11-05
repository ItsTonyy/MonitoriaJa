import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface PixState {
  orderId: string;
  orderValue: string;
  pixCode: string | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage: string | null;
}

const initialState: PixState = {
  orderId: '#0000',
  orderValue: '0,00',
  pixCode: null,
  status: 'idle',
  errorMessage: null,
};

// AsyncThunk para gerar código PIX
export const gerarCodigoPix = createAsyncThunk(
  'pix/gerarCodigoPix',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { pix: PixState };
      const { orderId, orderValue } = state.pix;

      // Mock: simular geração de código
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const pixCodeGerado = `00020126580014br.gov.bcb.pix0136codigo-pix-${orderValue}-1234567895204000053039865802BR5913NomePagador6009SAO PAULO62410503***50300017br.gov.bcb.brcode01051.0.063041D3A`;

      return pixCodeGerado;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao gerar código PIX');
    }
  }
);

// AsyncThunk para copiar código PIX
export const copiarCodigoPix = createAsyncThunk(
  'pix/copiarCodigoPix',
  async (pixCode: string, { rejectWithValue }) => {
    try {
      await navigator.clipboard.writeText(pixCode);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Erro ao copiar código PIX');
    }
  }
);

const pixSlice = createSlice({
  name: 'pix',
  initialState,
  reducers: {
    setOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
    setOrderValue: (state, action: PayloadAction<string>) => {
      state.orderValue = action.payload;
    },
    setOrderValueFromValorPorHora: (state, action: PayloadAction<string>) => {
      state.orderValue = action.payload;
    },
    resetPixStatus: (state) => {
      state.status = 'idle';
      state.errorMessage = null;
    },
    resetPix: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(gerarCodigoPix.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(gerarCodigoPix.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'idle';
        state.pixCode = action.payload;
      })
      .addCase(gerarCodigoPix.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage =
          (action.payload as string) || 'Erro ao gerar código PIX';
      });

    builder
      .addCase(copiarCodigoPix.pending, (state) => {
        state.status = 'loading';
        state.errorMessage = null;
      })
      .addCase(copiarCodigoPix.fulfilled, (state) => {
        state.status = 'success';
        state.errorMessage = null;
      })
      .addCase(copiarCodigoPix.rejected, (state, action) => {
        state.status = 'error';
        state.errorMessage =
          (action.payload as string) || 'Erro ao copiar código PIX';
      });
  },
});

export const {
  setOrderId,
  setOrderValue,
  resetPixStatus,
  resetPix,
  setOrderValueFromValorPorHora,
} = pixSlice.actions;

export default pixSlice.reducer;
