import { API } from "../../../config/api";
import { Usuario } from "../../../models/usuario.model";

const BASE_URL = `${API.URL}/usuario`;

// Lista todos os monitores (usuários com tipoUsuario "MONITOR" e isAtivo true)
export async function listarMonitores(): Promise<Usuario[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/tipo/MONITOR`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Erro ao buscar monitores");
  return response.json();
}

// Busca monitor por id (garante que o usuário é monitor e ativo)
export async function buscarMonitorPorId(id: string | number): Promise<Usuario> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Monitor não encontrado");
  const usuario = await response.json();
  if (!usuario.isAtivo) throw new Error("Monitor não encontrado");
  if (usuario.tipoUsuario !== "MONITOR") throw new Error("Usuário não é monitor");
  return usuario;
}

// Cria monitor (cria usuário com tipoUsuario "MONITOR")
export async function criarMonitor(monitor: Usuario): Promise<Usuario> {
  const monitorData = { ...monitor, tipoUsuario: "MONITOR", isAtivo: true };
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitorData),
  });
  if (!response.ok) throw new Error("Erro ao criar monitor");
  return response.json();
}

// Atualiza monitor (usuário com tipoUsuario "MONITOR")
export async function atualizarMonitor(id: string | number, monitor: Partial<Usuario>): Promise<Usuario> {
  const monitorData = { ...monitor, tipoUsuario: "MONITOR" };
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitorData),
  });
  if (!response.ok) throw new Error("Erro ao atualizar monitor");
  return response.json();
}

// Exclui monitor (exclusão lógica)
export async function excluirMonitor(id: string | number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir monitor");
}