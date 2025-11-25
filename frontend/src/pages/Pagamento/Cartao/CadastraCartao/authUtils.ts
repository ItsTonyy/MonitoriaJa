// src/utils/authUtils.ts

/**
 * Interface para o payload decodificado do token JWT
 */
export interface TokenPayload {
  id?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const decodeToken = (token: string): TokenPayload | null => {
  try {
    // Divide o token em suas três partes (header.payload.signature)
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('Token JWT inválido: formato incorreto');
      return null;
    }

    // Decodifica o payload (segunda parte do token)
    const payload = parts[1];
    const decodedPayload = JSON.parse(atob(payload));
    
    return decodedPayload;
  } catch (error) {
    console.error('Erro ao decodificar token JWT:', error);
    return null;
  }
};

export const getToken = (): string | null => {
  try {
    return localStorage.getItem('token');
  } catch (error) {
    console.error('Erro ao acessar localStorage:', error);
    return null;
  }
};

export const getUserIdFromToken = (): string | null => {
  const token = getToken();
  
  if (!token) {
    console.error('Token não encontrado no localStorage');
    return null;
  }

  const payload = decodeToken(token);
  
  if (!payload) {
    return null;
  }

  // Tenta diferentes campos que podem conter o ID do usuário
  return payload.id || null;
};

export const isTokenExpired = (): boolean => {
  const token = getToken();
  
  if (!token) {
    return true;
  }

  const payload = decodeToken(token);
  
  if (!payload || !payload.exp) {
    return true;
  }

  // exp está em segundos, Date.now() está em milissegundos
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  return token !== null && !isTokenExpired();
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Erro ao remover token do localStorage:', error);
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Erro ao salvar token no localStorage:', error);
  }
};