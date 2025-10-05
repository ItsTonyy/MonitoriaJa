import usuariosData from '../backend-mock.json';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'monitor' | 'user';
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await delay(1500);

    const user = usuariosData.usuarios.find(u => u.email === credentials.email);

    if (!user) {
      throw new Error('Email não encontrado.');
    }

    if (user.password !== credentials.password) {
      throw new Error('Senha incorreta.');
    }

    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword as Omit<User, 'password'>,
      token: `fake-jwt-token-${user.role}-${user.id}-${Date.now()}`,
    };
  },

  async resetPassword(email: string): Promise<{ message: string }> {
    await delay(1500);

    const user = usuariosData.usuarios.find(u => u.email === email);

    if (!user) {
      throw new Error('Email não encontrado.');
    }

    return {
      message: 'Email de recuperação enviado com sucesso!',
    };
  },

  async validateToken(token: string): Promise<boolean> {
    await delay(500);
    return token.startsWith('fake-jwt-token-');
  },
};
