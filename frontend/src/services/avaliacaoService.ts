import { api } from "./api";
import type { Avaliacao } from "../models/avaliacao.model";

const base = "/avaliacao";

export const avaliacaoService = {
  create: (payload: Omit<Avaliacao, "id" | "dataAvaliacao"> & { dataAvaliacao?: Date }) =>
    api.post<{ message: string }>(`${base}/`, {
      ...payload,
      dataAvaliacao: payload.dataAvaliacao || new Date(),
    }),
  getAll: () => api.get<Avaliacao[]>(`${base}/`),
  getById: (id: string) => api.get<Avaliacao>(`${base}/${id}`),
  update: (id: string, patch: Partial<Avaliacao>) => api.patch<Partial<Avaliacao>>(`${base}/${id}`, patch),
  remove: (id: string) => api.delete<{ message: string }>(`${base}/${id}`),
  getByMonitorId: (monitorId: string) => api.get<Avaliacao[]>(`${base}/monitor/${monitorId}`),
  like: (id: string) => api.post<{ likes: number; dislikes: number }>(`${base}/${id}/like`, {}),
  dislike: (id: string) => api.post<{ likes: number; dislikes: number }>(`${base}/${id}/dislike`, {}),
};
