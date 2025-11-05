import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Avaliacao,
  criarAvaliacaoServer,
  buscarAvaliacoesServer,
  buscarAvaliacaoPorIdServer,
  atualizarAvaliacaoServer,
} from "./fetch";

export interface AvaliacaoState {
  avaliacoes: Avaliacao[];
  avaliacaoAtual: Avaliacao | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AvaliacaoState = {
  avaliacoes: [],
  avaliacaoAtual: null,
  loading: false,
  error: null,
  success: false,
};

const avaliacaoSlice = createSlice({
  name: "avaliacao",
  initialState,
  reducers: {
    limparEstadoAvaliacao: (state) => {
      state.avaliacaoAtual = null;
      state.error = null;
      state.success = false;
    },
    setAvaliacaoAtual: (state, action: PayloadAction<Avaliacao>) => {
      state.avaliacaoAtual = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(criarAvaliacaoServer.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(criarAvaliacaoServer.fulfilled, (state, action) => {
      state.loading = false;
      state.avaliacoes.push(action.payload);
      state.avaliacaoAtual = action.payload;
      state.success = true;
    });
    builder.addCase(criarAvaliacaoServer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erro ao criar avaliação";
      state.success = false;
    });

    builder.addCase(buscarAvaliacoesServer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(buscarAvaliacoesServer.fulfilled, (state, action) => {
      state.loading = false;
      state.avaliacoes = action.payload;
    });
    builder.addCase(buscarAvaliacoesServer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erro ao buscar avaliações";
    });

    builder.addCase(buscarAvaliacaoPorIdServer.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(buscarAvaliacaoPorIdServer.fulfilled, (state, action) => {
      state.loading = false;
      state.avaliacaoAtual = action.payload;
    });
    builder.addCase(buscarAvaliacaoPorIdServer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erro ao buscar avaliação";
    });

    builder.addCase(atualizarAvaliacaoServer.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    });
    builder.addCase(atualizarAvaliacaoServer.fulfilled, (state, action) => {
      state.loading = false;
      state.avaliacoes = state.avaliacoes.map((avaliacao) =>
        avaliacao.id === action.payload.id ? action.payload : avaliacao
      );
      state.avaliacaoAtual = action.payload;
      state.success = true;
    });
    builder.addCase(atualizarAvaliacaoServer.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Erro ao atualizar avaliação";
      state.success = false;
    });
  },
});

export const { limparEstadoAvaliacao, setAvaliacaoAtual } =
  avaliacaoSlice.actions;
export default avaliacaoSlice.reducer;
