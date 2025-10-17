// src/redux/features/listaCartao/fetch.ts
export type Cartao = {
  id: number;
  numero: string;
  nome: string;
  bandeira: 'Visa' | 'MasterCard' | 'Elo';
  usuarioId: number;
};

export const getCartoes = async (usuarioId?: number): Promise<Cartao[]> => {
  const url = usuarioId 
    ? `http://localhost:3000/cartoes?usuarioId=${usuarioId}`
    : 'http://localhost:3000/cartoes';
  
  const response = await fetch(url);
  return await response.json();
};

export const addCartao = async (novoCartao: Omit<Cartao, 'id'>): Promise<Cartao> => {
  const response = await fetch('http://localhost:3000/cartoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoCartao)
  });
  return await response.json();
};

export const removeCartao = async (id: number): Promise<void> => {
  await fetch(`http://localhost:3000/cartoes/${id}`, {
    method: 'DELETE'
  });
};