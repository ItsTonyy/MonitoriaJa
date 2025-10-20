import { AppThunk } from "../../store";
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

export const buscarAvaliacoesPorUsuario =
  (usuarioId: number): AppThunk =>
  async (dispatch) => {
    try {
      await dispatch(buscarAvaliacoesServer({ usuarioId }));
    } catch (error) {
      console.error("Erro ao buscar avaliações do usuário:", error);
    }
  };

export const buscarAvaliacoesPorMonitor =
  (monitorId: number): AppThunk =>
  async (dispatch) => {
    try {
      await dispatch(buscarAvaliacoesServer({ monitorId }));
    } catch (error) {
      console.error("Erro ao buscar avaliações do monitor:", error);
    }
  };

export const buscarAvaliacaoPorId =
  (avaliacaoId: number): AppThunk =>
  async (dispatch) => {
    try {
      await dispatch(buscarAvaliacaoPorIdServer(avaliacaoId));
    } catch (error) {
      console.error("Erro ao buscar avaliação:", error);
    }
  };

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

export const limparAvaliacao = (): AppThunk => (dispatch) => {
  dispatch(limparEstadoAvaliacao());
};
