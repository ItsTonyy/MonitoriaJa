import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './login/slice.ts';
import { notificacoesReducer } from './notificacoes/slice.ts';


export const store = configureStore({
  reducer:{
      auth: loginReducer,
      notificacoesReducer: notificacoesReducer,
  }
})



export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
