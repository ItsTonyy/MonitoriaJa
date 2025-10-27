import { createAsyncThunk } from "@reduxjs/toolkit";
import { httpGet } from "../../../utils";

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

export const fetchUsuariosAdmin = createAsyncThunk<UsuarioCompleto[]>(
  'admin/fetchUsuarios',
  async () => {
    try {
      const usuarios = await httpGet('http://localhost:3001/usuarios');
      
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
      const usuariosProcessados: UsuarioCompleto[] = usuarios.map((usuario: any) => {
        console.log('Processando usuário:', usuario);
        
        return {
          id: usuario.id || '',
          name: usuario.name || usuario.nome || '',
          email: usuario.email || '',
          telefone: usuario.telefone || '',
          role: usuario.role || 'user',
          foto: usuario.foto,
          // Campos específicos de monitor (se existirem)
          materia: usuario.materia,
          valor: usuario.valor,
          avaliacao: usuario.avaliacao,
        };
      });
      
      console.log('Usuários processados:', usuariosProcessados);
      console.log('Total:', usuariosProcessados.length);
      console.log('==========================');
      
      return usuariosProcessados;
      
    } catch (error) {
      console.error('ERRO ao buscar usuários:', error);
      throw error;
    }
  }
);