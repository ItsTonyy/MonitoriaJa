
import { API } from "../../../config/api";
import { Monitor } from "../../../models/monitor.model";


const BASE_URL = `${API.URL}/monitores`;

export async function listarMonitores(): Promise<Monitor[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar monitores");
  return response.json();
}

export async function buscarMonitorPorId(id: number): Promise<Monitor> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Monitor não encontrado");
  return response.json();
}

export async function criarMonitor(monitor: Monitor): Promise<Monitor> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitor),
  });
  if (!response.ok) throw new Error("Erro ao criar monitor");
  return response.json();
}

export async function atualizarMonitor(id: number, monitor: Partial<Monitor>): Promise<Monitor> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(monitor),
  });
  if (!response.ok) throw new Error("Erro ao atualizar monitor");
  return response.json();
}

export async function removerMonitor(id: number): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao remover monitor");
  return true;
}