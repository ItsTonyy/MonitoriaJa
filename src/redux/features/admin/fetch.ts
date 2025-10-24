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
    const usuarios = await httpGet('http://localhost:3001/usuarios')

    const usuariosMap = new Map<string, UsuarioCompleto>();

    // Adiciona todos os usuários
    usuarios.forEach((usuario: UsuarioAdmin) => {
      usuariosMap.set(usuario.id, {
        id: usuario.id,
        name: usuario.name,
        email: usuario.email || '',
        telefone: usuario.telefone || '',
        foto: usuario.foto,
        role: usuario.role,
      });
      console.log("Se liga", usuario)
    });
    
    // Enriquece dados dos monitores
    usuarios.forEach((monitor: MonitorAdmin) => {
      if (usuariosMap.has(monitor.id)) {
        const usuario = usuariosMap.get(monitor.id)!;
        usuariosMap.set(monitor.id, {
          ...usuario,
          name: monitor.nome,
          materia: monitor.materia,
          valor: monitor.valor,
          avaliacao: monitor.avaliacao,
          foto: monitor.foto || usuario.foto,
          role: monitor.role
        });
      } else {
        // Se monitor não existe em usuarios, adiciona com role monitor
        usuariosMap.set(monitor.id, {
          id: monitor.id,
          name: monitor.nome,
          email: monitor.email || '',
          telefone: monitor.telefone || '',
          role: 'monitor',
          foto: monitor.foto,
          materia: monitor.materia,
          valor: monitor.valor,
          avaliacao: monitor.avaliacao,
        });
      }
    });

    return Array.from(usuariosMap.values());
  }
);
