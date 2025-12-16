import { API } from "../../../config/api";
import { Disciplina } from "../../../models/disciplina.model";


const BASE_URL = `${API.URL}/disciplina`;

export async function listarDisciplinas(): Promise<Disciplina[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Erro ao buscar disciplinas");
  return response.json();
}

export async function buscarDisciplinaPorId(id: string): Promise<Disciplina> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) throw new Error("Disciplina não encontrada");
  return response.json();
}

export async function criarDisciplina(disciplina: { nome: string }): Promise<Disciplina> {
  const token = localStorage.getItem("token");
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(disciplina),
  });
  if (!response.ok) throw new Error("Erro ao criar disciplina");
  return response.json();
}

export async function atualizarDisciplina(id: string, disciplina: Partial<Disciplina>): Promise<Disciplina> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(disciplina),
  });
  if (!response.ok) throw new Error("Erro ao atualizar disciplina");
  return response.json();
}

export async function removerDisciplina(id: string): Promise<boolean> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Erro ao remover disciplina");
  return true;
}

// Para listar monitores de uma disciplina
export async function listarMonitoresPorDisciplina(disciplinaId: string) {
  const response = await fetch(`${BASE_URL}/monitor/${disciplinaId}`);
  if (!response.ok) throw new Error("Erro ao buscar monitores da disciplina");
  return response.json();
}

export async function adicionarMonitorNaDisciplina(disciplinaId: string, monitorId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/monitor`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ disciplinaId, monitorId }), 
  });
  if (!response.ok) throw new Error("Erro ao adicionar monitor à disciplina");
}