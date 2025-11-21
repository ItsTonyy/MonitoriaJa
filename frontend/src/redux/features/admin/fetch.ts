import { createAsyncThunk } from "@reduxjs/toolkit";
import { getToken, isTokenExpired } from "../../../pages/Pagamento/Cartao/CadastraCartao/authUtils";

export interface UsuarioAdmin {
  id: string;
  name: string;
  email?: string;
  telefone?: string;
  role: 'admin' | 'monitor' | 'user';
  foto?: string;
}

export interface MonitorAdmin {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  foto?: string;
  materia?: string;
  valor?: string;
  avaliacao?: number;
  role: 'admin' | 'monitor' | 'user';
}

export interface UsuarioCompleto {
  id: string;
  name: string;
  email: string;
  telefone: string;
  role: 'admin' | 'monitor' | 'user';
  foto?: string;
  materia?: string;
  valor?: string;
  avaliacao?: number;
}

export const fetchUsuariosAdmin = createAsyncThunk<
  UsuarioCompleto[],
  void,
  { rejectValue: string }
>(
  'admin/fetchUsuarios',
  async (_, { rejectWithValue }) => {
    try {
      // Verifica token apenas para segurança no frontend
      const token = getToken();
      console.log('🔑 Token encontrado:', token ? 'Sim' : 'Não');
      
      if (!token || isTokenExpired()) {
        console.log('❌ Token inválido ou expirado');
        return rejectWithValue("Token inválido ou expirado. Faça login novamente.");
      }

      // Faz requisição GET /usuario (retorna todos os usuários ativos)
      // Backend NÃO tem middleware de autenticação nesta rota
      // Mas enviamos o token para possível uso futuro
      const response = await fetch('http://localhost:3001/usuario', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error("Erro ao buscar usuários");
      }

      const usuarios = await response.json();
      
      console.log('===== FETCH USUARIOS =====');
      console.log('Resposta da API:', usuarios);
      console.log('Tipo:', typeof usuarios);
      console.log('É array?', Array.isArray(usuarios));
      
      // Verifica se é array
      if (!Array.isArray(usuarios)) {
        console.error('API não retornou um array:', usuarios);
        return [];
      }
      
      // Mapeia os usuários diretamente
      const usuariosProcessados: UsuarioCompleto[] = usuarios
        .filter((usuario: any) => usuario.isAtivo !== false) // Filtra apenas usuários ativos
        .map((usuario: any) => {
          console.log('Processando usuário:', usuario);
          
          // Mapeia tipoUsuario para role para compatibilidade
          let role: 'admin' | 'monitor' | 'user' = 'user';
          if (usuario.tipoUsuario === 'ADMIN') {
            role = 'admin';
          } else if (usuario.tipoUsuario === 'MONITOR') {
            role = 'monitor';
          } else if (usuario.tipoUsuario === 'ALUNO') {
            role = 'user';
          } else if (usuario.role) {
            // Fallback para o campo role antigo
            role = usuario.role;
          }

          // Processa listaDisciplinas (vem como array de strings após populate)
          let materia: string | undefined;
          if (usuario.listaDisciplinas && Array.isArray(usuario.listaDisciplinas)) {
            materia = usuario.listaDisciplinas.join(', ');
          } else if (usuario.materia) {
            materia = usuario.materia;
          }
          
          return {
            id: usuario.id || usuario._id || '',
            name: usuario.name || usuario.nome || '',
            email: usuario.email || '',
            telefone: usuario.telefone || '',
            role: role,
            foto: usuario.foto || usuario.fotoUrl,
            // Campos específicos de monitor (se existirem)
            materia: materia,
            valor: usuario.valor,
            avaliacao: usuario.avaliacao,
          };
        });
      
      console.log('Usuários processados:', usuariosProcessados);
      console.log('Total:', usuariosProcessados.length);
      console.log('==========================');
      
      return usuariosProcessados;
      
    } catch (error: any) {
      console.error('ERRO ao buscar usuários:', error);
      return rejectWithValue(error.message || 'Erro ao buscar usuários');
    }
  }
);

// Função para remover usuário (soft delete - marca como inativo)
export const removerUsuario = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'admin/removerUsuario',
  async (userId, { rejectWithValue }) => {
    try {
      const token = getToken();
      
      if (!token || isTokenExpired()) {
        return rejectWithValue("Token inválido ou expirado. Faça login novamente.");
      }

      console.log('🗑️ Removendo usuário:', userId);

      // Primeiro busca o usuário (usa ownerOrAdminAuth)
      const getResponse = await fetch(`http://localhost:3001/usuario/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!getResponse.ok) {
        if (getResponse.status === 401) {
          return rejectWithValue("Token não encontrado ou inválido!");
        }
        if (getResponse.status === 403) {
          return rejectWithValue("Acesso negado!");
        }
        throw new Error("Usuário não encontrado");
      }

      const usuario = await getResponse.json();

      // Marca como inativo (soft delete) - usa ownerOrAdminAuth
      const response = await fetch(`http://localhost:3001/usuario/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isAtivo: false
        }),
      });

      console.log('📡 Status da resposta:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          return rejectWithValue("Token não encontrado ou inválido!");
        }
        if (response.status === 403) {
          return rejectWithValue("Acesso negado!");
        }
        throw new Error('Erro ao remover usuário');
      }

      console.log('✅ Usuário removido com sucesso');
      return userId;
    } catch (error: any) {
      console.error('💥 Erro ao remover usuário:', error);
      return rejectWithValue(error.message || "Erro ao remover usuário");
    }
  }
);

// Função opcional para buscar usuários por tipo (ADMIN, MONITOR, ALUNO)
export const fetchUsuariosPorTipo = createAsyncThunk<
  UsuarioCompleto[],
  'ADMIN' | 'MONITOR' | 'ALUNO',
  { rejectValue: string }
>(
  'admin/fetchUsuariosPorTipo',
  async (tipoUsuario, { rejectWithValue }) => {
    try {
      const token = getToken();
      
      if (!token || isTokenExpired()) {
        return rejectWithValue("Token inválido ou expirado. Faça login novamente.");
      }

      console.log('🔍 Buscando usuários do tipo:', tipoUsuario);

      // Usa a rota GET /usuario/tipo/:tipoUsuario
      const response = await fetch(`http://localhost:3001/usuario/tipo/${tipoUsuario}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error(`Erro ao buscar usuários do tipo ${tipoUsuario}`);
      }

      const usuarios = await response.json();
      
      if (!Array.isArray(usuarios)) {
        console.error('API não retornou um array:', usuarios);
        return [];
      }

      // Mapeia para UsuarioCompleto (mesmo processo do fetchUsuariosAdmin)
      const usuariosProcessados: UsuarioCompleto[] = usuarios
        .filter((usuario: any) => usuario.isAtivo !== false)
        .map((usuario: any) => {
          let role: 'admin' | 'monitor' | 'user' = 'user';
          if (usuario.tipoUsuario === 'ADMIN') role = 'admin';
          else if (usuario.tipoUsuario === 'MONITOR') role = 'monitor';
          else if (usuario.tipoUsuario === 'ALUNO') role = 'user';

          let materia: string | undefined;
          if (usuario.listaDisciplinas && Array.isArray(usuario.listaDisciplinas)) {
            materia = usuario.listaDisciplinas.join(', ');
          } else if (usuario.materia) {
            materia = usuario.materia;
          }

          return {
            id: usuario.id || usuario._id || '',
            name: usuario.name || usuario.nome || '',
            email: usuario.email || '',
            telefone: usuario.telefone || '',
            role: role,
            foto: usuario.foto || usuario.fotoUrl,
            materia: materia,
            valor: usuario.valor,
            avaliacao: usuario.avaliacao,
          };
        });

      console.log('✅ Usuários processados:', usuariosProcessados.length);
      return usuariosProcessados;
      
    } catch (error: any) {
      console.error('💥 Erro ao buscar usuários por tipo:', error);
      return rejectWithValue(error.message || 'Erro ao buscar usuários');
    }
  }
);