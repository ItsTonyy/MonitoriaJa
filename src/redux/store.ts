import { configureStore } from '@reduxjs/toolkit';
import authReducer from './login/slice';
import notificacoesReducer from './notificacoes/slice';


export const store = configureStore({
  reducer:{
      auth: authReducer,
      notificacoes: notificacoesReducer,
  }
})



export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
