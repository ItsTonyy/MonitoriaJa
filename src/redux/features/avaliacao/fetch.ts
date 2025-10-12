import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpGet, httpPost, httpPut } from "../../../utils";

export interface Avaliacao {
  id: number;
  usuarioId: number;
  monitorId: number;
  nota: number; // 0 a 5
  comentario: string;
  data: string;
}

export interface NovaAvaliacao {
  usuarioId: number;
  monitorId: number;
  nota: number;
  comentario: string;
}

interface BuscarAvaliacoesParams {
  usuarioId?: number;
  monitorId?: number;
}

export const criarAvaliacaoServer = createAsyncThunk<Avaliacao, NovaAvaliacao>(
  "avaliacao/criarAvaliacaoServer",
  async (novaAvaliacao) => {
    const data = {
      ...novaAvaliacao,
      data: new Date().toISOString(),
    };

    const response = await httpPost("http://localhost:3000/avaliacoes", data);
    return response;
  }
);

export const buscarAvaliacoesServer = createAsyncThunk<
  Avaliacao[],
  BuscarAvaliacoesParams | void
>("avaliacao/buscarAvaliacoesServer", async (params) => {
  let endpoint = "http://localhost:3000/avaliacoes";

  if (params) {
    const queryParams = [];
    if (params.usuarioId) queryParams.push(`usuarioId=${params.usuarioId}`);
    if (params.monitorId) queryParams.push(`monitorId=${params.monitorId}`);

    if (queryParams.length > 0) {
      endpoint += `?${queryParams.join("&")}`;
    }
  }

  const response = await httpGet(endpoint);
  return response;
});

export const buscarAvaliacaoPorIdServer = createAsyncThunk<Avaliacao, number>(
  "avaliacao/buscarAvaliacaoPorIdServer",
  async (avaliacaoId) => {
    const response = await httpGet(
      `http://localhost:3000/avaliacoes/${avaliacaoId}`
    );
    return response;
  }
);

export const atualizarAvaliacaoServer = createAsyncThunk<Avaliacao, Avaliacao>(
  "avaliacao/atualizarAvaliacaoServer",
  async (avaliacao) => {
    const response = await httpPut(
      `http://localhost:3000/avaliacoes/${avaliacao.id}`,
      avaliacao
    );
    return response;
  }
);
