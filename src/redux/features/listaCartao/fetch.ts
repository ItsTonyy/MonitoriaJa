// src/services/fetchCartoes.ts
import backendMock from '../../../backend-mock.json';

export type Cartao = {
  id: number;
  numero: string;
  nome: string;
  bandeira: 'Visa' | 'MasterCard' | 'Elo';
};

// Chave para o localStorage
const CARTÕES_STORAGE_KEY = 'cartoes_data';

// Função para carregar do localStorage ou usar mock inicial
const loadCartoes = (): Cartao[] => {
  try {
    const stored = localStorage.getItem(CARTÕES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Se não há dados no localStorage, usa o mock inicial
    const initialCartoes = backendMock.cartoes.map(c => ({
      id: c.id,
      numero: c.numero,
      nome: c.nome,
      bandeira: c.bandeira as 'Visa' | 'MasterCard' | 'Elo',
    }));
    // Salva o mock inicial no localStorage
    localStorage.setItem(CARTÕES_STORAGE_KEY, JSON.stringify(initialCartoes));
    return initialCartoes;
  } catch (error) {
    console.error('Erro ao carregar cartões do localStorage:', error);
    return [];
  }
};

// Array em memória sincronizado com localStorage
let cartoes: Cartao[] = loadCartoes();

// Função para salvar no localStorage
const saveCartoes = (cartoesToSave: Cartao[]) => {
  try {
    localStorage.setItem(CARTÕES_STORAGE_KEY, JSON.stringify(cartoesToSave));
  } catch (error) {
    console.error('Erro ao salvar cartões no localStorage:', error);
  }
};

export const getCartoes = async (): Promise<Cartao[]> => {
  return [...cartoes];
};

export const addCartao = async (novoCartao: Omit<Cartao, 'id'>): Promise<Cartao> => {
  const maxId = cartoes.length > 0 ? Math.max(...cartoes.map(c => c.id)) : 0;
  const cartaoComId: Cartao = { id: maxId + 1, ...novoCartao };
  cartoes.push(cartaoComId);
  saveCartoes(cartoes); // Persiste no localStorage
  return cartaoComId;
};

export const removeCartao = async (id: number): Promise<void> => {
  cartoes = cartoes.filter(c => c.id !== id);
  saveCartoes(cartoes); // Persiste no localStorage
};