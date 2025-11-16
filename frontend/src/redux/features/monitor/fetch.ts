import { API } from "../../../config/api";
import { Usuario } from "../../../models/usuario.model";


const BASE_URL = `${API.URL}/usuario`;

// Lista todos os monitores (usuários com role "monitor")
export async function listarMonitores(): Promise<Usuario[]> {
  const response = await fetch(`${BASE_URL}?role=monitor&isAtivo=true`);
  if (!response.ok) throw new Error("Erro ao buscar monitores");
  return response.json();
}

// Busca monitor por id (garante que o usuário é monitor)
export async function buscarMonitorPorId(id: string | number): Promise<Usuario> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok ) throw new Error("Monitor não encontrado");
  const usuario = await response.json();
  if (!usuario.isAtivo) throw new Error("Monitor não encontrado");
  if (usuario.role !== "monitor") throw new Error("Usuário não é monitor");
  return usuario;
}

// Cria monitor (cria usuário com role "monitor")
export async function criarMonitor(monitor: Usuario): Promise<Usuario> {
  const monitorData = { ...monitor, isAtivo: true };
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitorData),
  });
  if (!response.ok) throw new Error("Erro ao criar monitor");
  return response.json();
}

// Atualiza monitor (usuário com role "monitor")
export async function atualizarMonitor(id: string | number, monitor: Partial<Usuario>): Promise<Usuario> {
  const monitorData = { ...monitor, role: "monitor" };
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitorData),
  });
  if (!response.ok) throw new Error("Erro ao atualizar monitor");
  return response.json();
}

