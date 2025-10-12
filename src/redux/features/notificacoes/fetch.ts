import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpGet, httpPut } from '../../../utils';
import type { Notificacao } from "./slice";

interface FetchNotificacoesParams {
  userId: number;
  userRole: 'admin' | 'monitor' | 'user';
}

export const fetchNotificacoes = createAsyncThunk<Notificacao[], FetchNotificacoesParams>(
  'notificacoes/fetchNotificacoes',
  async ({userId, userRole}) => {

     const notificacoes = await httpGet(`http://localhost:3000/notificacoes?userId=${userId}&role=${userRole}`);

      return notificacoes;
  }
);

export const markAsReadServer = createAsyncThunk<Notificacao, string>(
  'notificacoes/markAsReadServer',
  async (notificacaoId) => {
    const notificacao = await httpGet(`http://localhost:3000/notificacoes/${notificacaoId}`);
    
    if (!notificacao) {
      throw new Error('Notificação não encontrada');
    }
    
    const updatedNotificacao = await httpPut(
      `http://localhost:3000/notificacoes/${notificacaoId}`,
      { ...notificacao, lida: true }
    );
    
    return {
      id: updatedNotificacao.id,
      userId: updatedNotificacao.userId,
      tipo: updatedNotificacao.tipo as 'cancelamento' | 'reagendamento' | 'agendamento' | 'avaliacao' | 'agendamentoConfirmado',
      titulo: updatedNotificacao.titulo,
      previa: updatedNotificacao.previa,
      descricao: updatedNotificacao.descricao,
      tempo: updatedNotificacao.tempo,
      lida: updatedNotificacao.lida,
      role: updatedNotificacao.role as 'admin' | 'monitor' | 'user',
    };
  }
);
