export type Cartao = {
  id: number;
  numero: string;
  nome: string;
  bandeira: 'Visa' | 'MasterCard' | 'Elo';
  usuarioId: number;
};

export const getCartoes = async (usuarioId?: number): Promise<Cartao[]> => {
  const url = usuarioId
    ? `http://localhost:3001/cartoes?usuarioId=${usuarioId}`
    : 'http://localhost:3001/cartoes';

  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar cartões');
  return await response.json();
};

export const addCartao = async (novoCartao: Omit<Cartao, 'id'>): Promise<Cartao> => {
  const response = await fetch('http://localhost:3001/cartoes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoCartao),
  });

  if (!response.ok) throw new Error('Erro ao cadastrar cartão');
  return await response.json();
};

export const removeCartao = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:3001/cartoes/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Erro ao remover cartão');
};

export const confirmarPagamentoAPI = async (cartaoId: number): Promise<void> => {
  // Simulação de requisição
  await new Promise((resolve) => setTimeout(resolve, 1500));
  // Simula falha aleatória (para testar estado de erro)
  if (Math.random() < 0.2) throw new Error('Falha ao processar pagamento');
};
