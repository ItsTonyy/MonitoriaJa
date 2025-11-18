import { api } from "./api";
import type { Usuario } from "../models/usuario.model";

const base = "/usuarios";

export const usuarioService = {
  // Lista usuários com filtros (ex.: role=monitor&isAtivo=true)
  getAll: (query?: string) => api.get<Usuario[]>(`${base}${query ? `?${query}` : ``}`),
  // Busca usuário por id
  getById: (id: string | number) => api.get<Usuario>(`${base}/${id}`),
  // Conveniência: lista apenas monitores ativos
  getMonitoresAtivos: () => api.get<Usuario[]>(`${base}?role=monitor&isAtivo=true`),
};