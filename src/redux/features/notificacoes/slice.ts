import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../root-reducer";
import { fetchNotificacoes, markAsReadServer } from "./fetch";

export interface Notificacao {
  id: string;
  userId: number;
  tipo: 'cancelamento' | 'reagendamento' | 'agendamento' | 'avaliacao' | 'agendamentoConfirmado';
  titulo: string;
  previa: string;
  descricao: string;
  tempo: string;
  lida: boolean;
  role: 'admin' | 'monitor' | 'user';
}

export type InitialState = {
  status: 'not_loaded' | 'loading' | 'loaded' | 'failed' | 'saving' | 'saved' | 'deleting' | 'deleted';
  error: string | null;
}

const notificacaoAdapter = createEntityAdapter<Notificacao>({
  sortComparer: (a, b) => {
    
    if (a.lida !== b.lida) {
      return a.lida ? 1 : -1;
    }
    return 0;
  }
});

const notificacaoInitialState = notificacaoAdapter.getInitialState<InitialState>({
  status: 'not_loaded',
  error: null 
});

const notificacoesSlice = createSlice({
  name: 'notificacoes',
  initialState: notificacaoInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificacoes.pending,   (state) => { state.status = 'loading' })
      .addCase(fetchNotificacoes.fulfilled, (state, action) => { 
        state.status = 'loaded'; 
        notificacaoAdapter.setAll(state, action.payload) 
      })
      .addCase(fetchNotificacoes.rejected,  (state) => { 
        state.status = 'failed'; 
        state.error = 'Falha ao buscar notificações!' 
      })
      .addCase(markAsReadServer.pending,          (state) => { state.status = 'saving' })
      .addCase(markAsReadServer.fulfilled,        (state, action) => { 
        state.status = 'saved'; 
        notificacaoAdapter.upsertOne(state, action.payload) 
      })
      .addCase(markAsReadServer.rejected,         (state) => { 
        state.status = 'failed'; 
        state.error = 'Falha ao marcar notificação como lida!' 
      })
  }
});

const notificacoesReducer = notificacoesSlice.reducer;

export default notificacoesReducer;

export const {
  selectAll: selectAllNotificacoes,
  selectById: selectNotificacaoById,
  selectIds: selectNotificacaoIds
} = notificacaoAdapter.getSelectors((state: RootState) => state.notificacoes);
