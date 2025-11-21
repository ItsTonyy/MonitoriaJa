import { api } from "./api";
import type { Disponibilidade } from "../models/disponibilidade.model";

const base = "/disponibilidade";

export const disponibilidadeService = {
  create: (payload: Omit<Disponibilidade, "id">) => api.post<{ message: string }>(`${base}/`, payload),
  getAll: () => api.get<Disponibilidade[]>(`${base}/`),
  getById: (id: string) => api.get<Disponibilidade>(`${base}/${id}`),
  update: (id: string, patch: Partial<Disponibilidade>) => api.patch<Partial<Disponibilidade>>(`${base}/${id}`, patch),
  remove: (id: string) => api.delete<{ message: string }>(`${base}/${id}`),
  getByMonitorId: (monitorId: string) => api.get<Disponibilidade[]>(`${base}/monitor/${monitorId}`),
};