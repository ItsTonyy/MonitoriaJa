import { API } from "../../../config/api";
import { Monitor } from "../../../models/monitor.model";

const BASE_URL = `${API.URL}/usuarios`;

// Lista todos os monitores (usuários com role "monitor")
export async function listarMonitores(): Promise<Monitor[]> {
  const response = await fetch(`${BASE_URL}?role=monitor&isAtivo=true`);
  if (!response.ok) throw new Error("Erro ao buscar monitores");
  return response.json();
}

// Busca monitor por id (garante que o usuário é monitor)
export async function buscarMonitorPorId(id: string | number): Promise<Monitor> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok ) throw new Error("Monitor não encontrado");
  const usuario = await response.json();
  if (!usuario.isAtivo) throw new Error("Monitor não encontrado");
  if (usuario.role !== "monitor") throw new Error("Usuário não é monitor");
  return usuario;
}

// Cria monitor (cria usuário com role "monitor")
export async function criarMonitor(monitor: Monitor): Promise<Monitor> {
  const monitorData = { ...monitor, role: "monitor", isAtivo: true };
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitorData),
  });
  if (!response.ok) throw new Error("Erro ao criar monitor");
  return response.json();
}

// Atualiza monitor (usuário com role "monitor")
export async function atualizarMonitor(id: string | number, monitor: Partial<Monitor>): Promise<Monitor> {
  const monitorData = { ...monitor, role: "monitor" };
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitorData),
  });
  if (!response.ok) throw new Error("Erro ao atualizar monitor");
  return response.json();
}

