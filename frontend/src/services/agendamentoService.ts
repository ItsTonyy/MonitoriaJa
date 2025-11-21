import { api } from "./api";
import type { Agendamento } from "../models/agendamento.model";

const base = "/agendamento";

export const agendamentoService = {
  create: (payload: Omit<Agendamento, "id">) => api.post<{ message: string }>(`${base}/`, payload),
  getAll: () => api.get<Agendamento[]>(`${base}/`),
  getById: (id: string) => api.get<Agendamento>(`${base}/${id}`),
  update: (id: string, patch: Partial<Agendamento>) => api.patch<Partial<Agendamento>>(`${base}/${id}`, patch),
  remove: (id: string) => api.delete<{ message: string }>(`${base}/${id}`),
};