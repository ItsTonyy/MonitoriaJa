// src/services/fetchCartoes.ts
import backendMock from '../../../backend-mock.json';

export type Cartao = {
  id: number;
  numero: string;
  nome: string;
  bandeira: 'Visa' | 'MasterCard' | 'Elo';
};

// Fazemos uma cópia em memória para simular persistência
let cartoes: Cartao[] = backendMock.cartoes.map(c => ({
  id: c.id,
  numero: c.numero,
  nome: c.nome,
  bandeira: c.bandeira as 'Visa' | 'MasterCard' | 'Elo', // <-- força o tipo
}));

export const getCartoes = async (): Promise<Cartao[]> => {
  return [...cartoes];
};

export const addCartao = async (novoCartao: Omit<Cartao, 'id'>): Promise<Cartao> => {
  const maxId = cartoes.length > 0 ? Math.max(...cartoes.map(c => c.id)) : 0;
  const cartaoComId: Cartao = { id: maxId + 1, ...novoCartao };
  cartoes.push(cartaoComId);
  return cartaoComId;
};

export const removeCartao = async (id: number): Promise<void> => {
  cartoes = cartoes.filter(c => c.id !== id);
};
