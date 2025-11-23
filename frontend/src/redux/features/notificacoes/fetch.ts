import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpGet, httpPut } from '../../../utils';
import type { Notificacao } from "./slice";

interface FetchNotificacoesParams {
  userId: number;
  userRole: 'admin' | 'monitor' | 'user';
}

export const fetchNotificacoes = createAsyncThunk<Notificacao[], FetchNotificacoesParams>(
  'notificacoes/fetchNotificacoes',
  async () => {
     const token = localStorage.getItem('token');
     
     if (!token) {
       throw new Error('Token não encontrado');
     }

     const notificacoes = await httpGet(`http://localhost:3001/notificacao/destinatario/`, {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     });
     
     console.log("Notificações buscadas:", notificacoes);
     return notificacoes;
  }
);

export const markAsReadServer = createAsyncThunk<Notificacao, string>(
  'notificacoes/markAsReadServer',
  async (notificacaoId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`http://localhost:3001/notificacao/${notificacaoId}/marcar-lida`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Erro ao marcar notificação como lida');
    }
    
    const updatedNotificacao = await response.json();
    
    return updatedNotificacao;
  }
);
