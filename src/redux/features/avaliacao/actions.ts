import { AppThunk, AppDispatch } from "../../store";
import {
  criarAvaliacaoServer,
  buscarAvaliacoesServer,
  buscarAvaliacaoPorIdServer,
  atualizarAvaliacaoServer,
  Avaliacao,
  NovaAvaliacao,
} from "./fetch";
import { limparEstadoAvaliacao, setAvaliacaoAtual } from "./slice";

export const criarAvaliacao =
  (novaAvaliacao: NovaAvaliacao): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(limparEstadoAvaliacao());
      await dispatch(criarAvaliacaoServer(novaAvaliacao));
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
    }
  };

export const buscarAvaliacoes = (): AppThunk => async (dispatch) => {
  try {
    await dispatch(buscarAvaliacoesServer());
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
  }
};

// Action para buscar avaliações por ID de usuário
export const buscarAvaliacoesPorUsuario =
  (usuarioId: number): AppThunk =>
  async (dispatch) => {
    try {
      await dispatch(buscarAvaliacoesServer({ usuarioId }));
    } catch (error) {
      console.error("Erro ao buscar avaliações do usuário:", error);
    }
  };

// Action para buscar avaliações por ID de monitor
export const buscarAvaliacoesPorMonitor =
  (monitorId: number): AppThunk =>
  async (dispatch) => {
    try {
      await dispatch(buscarAvaliacoesServer({ monitorId }));
    } catch (error) {
      console.error("Erro ao buscar avaliações do monitor:", error);
    }
  };

// Action para buscar uma avaliação específica por ID
export const buscarAvaliacaoPorId =
  (avaliacaoId: number): AppThunk =>
  async (dispatch) => {
    try {
      await dispatch(buscarAvaliacaoPorIdServer(avaliacaoId));
    } catch (error) {
      console.error("Erro ao buscar avaliação:", error);
    }
  };

// Action para atualizar uma avaliação existente
export const atualizarAvaliacao =
  (avaliacao: Avaliacao): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(limparEstadoAvaliacao());
      await dispatch(atualizarAvaliacaoServer(avaliacao));
    } catch (error) {
      console.error("Erro ao atualizar avaliação:", error);
    }
  };

// Action para limpar o estado atual da avaliação
export const limparAvaliacao = (): AppThunk => (dispatch) => {
  dispatch(limparEstadoAvaliacao());
};
