import { createAsyncThunk } from "@reduxjs/toolkit";
import backendMock from '../../backend-mock.json';
import type { Notificacao } from "./slice";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface FetchNotificacoesParams {
  userId: number;
  userRole: 'admin' | 'monitor' | 'user';
}

export const fetchNotificacoes = createAsyncThunk<Notificacao[], FetchNotificacoesParams>(
  'notificacoes/fetchNotificacoes',
  async ({ userId, userRole }) => {
    await delay(500);
    const notificacoes = backendMock.notificacoes.filter(
      (notificacao) => 
        notificacao.userId === userId && 
        notificacao.role === userRole
    );
    
    return notificacoes.map(notificacao => ({
      id: notificacao.id,
      userId: notificacao.userId,
      tipo: notificacao.tipo as 'cancelamento' | 'reagendamento' | 'agendamento' | 'avaliacao' | 'agendamentoConfirmado',
      titulo: notificacao.titulo,
      previa:notificacao.previa,
      descricao: notificacao.descricao,
      tempo: notificacao.tempo,
      lida: notificacao.lida,
      role: notificacao.role as 'admin' | 'monitor' | 'user',
    }));
  }
);

export const markAsReadServer = createAsyncThunk<Notificacao, string>(
  'notificacoes/markAsReadServer',
  async (notificacaoId) => {
    await delay(300);
    
    const notificacao = backendMock.notificacoes.find(n => n.id === notificacaoId);
    if (!notificacao) {
      throw new Error('Notificação não encontrada');
    }
    
    notificacao.lida = true;
    
    return {
      id: notificacao.id,
      userId: notificacao.userId,
      tipo: notificacao.tipo as 'cancelamento' | 'reagendamento' | 'agendamento' | 'avaliacao' | 'agendamentoConfirmado',
      titulo: notificacao.titulo,
      previa: notificacao.previa,
      descricao: notificacao.descricao,
      tempo: notificacao.tempo,
      lida: notificacao.lida,
      role: notificacao.role as 'admin' | 'monitor' | 'user',
    };
  }
);