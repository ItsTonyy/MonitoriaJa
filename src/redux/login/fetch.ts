import backendMock from '../../backend-mock.json';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'monitor' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1500);

  const usuario = backendMock.usuarios.find(u => u.email === credentials.email);

  if (!usuario) {
    throw new Error('Email não encontrado.');
  }

  if (usuario.password !== credentials.password) {
    throw new Error('Senha incorreta.');
  }

  const { password, ...user } = usuario;
  
  return {
    user: user as User,
    token: `fake-jwt-token-${usuario.role}-${usuario.id}-${Date.now()}`,
  };
};

export const fetchResetPassword = async (email: string): Promise<{ message: string }> => {
  await delay(1500);

  const usuario = backendMock.usuarios.find(u => u.email === email);

  if (!usuario) {
    throw new Error('Email não encontrado.');
  }

  return {
    message: 'Email de recuperação enviado com sucesso!',
  };
};
