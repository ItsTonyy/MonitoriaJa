import { API } from "../../../config/api";
import { Usuario } from "../../../models/usuario.model";

const BASE_URL = `${API.URL}/usuario`;

// Criar usuário (cria usuário com role "aluno")
export async function criarAluno(usuario: Usuario): Promise<Usuario> {
  const alunoData = { ...usuario, tipoUsuario: "ALUNO", isAtivo: true };
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify(alunoData),
  });
  if (!response.ok) throw new Error("Erro ao criar aluno");
  return response.json();
}

// Atualiza usuário (usuário com role "aluno")
export async function atualizarAluno(id: string | number, aluno: Partial<Usuario>): Promise<Usuario> {
  const alunoData = { ...aluno, tipoUsuario: "ALUNO", };
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(alunoData),
  });
  if (!response.ok) throw new Error("Erro ao atualizar aluno");
  return response.json();
}

// Busca aluno por id (garante que o usuário é aluno)
export async function buscarAlunoPorId(id: string | number): Promise<Usuario> {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok ) throw new Error("Aluno não encontrado");
  const usuario = await response.json();
  if (!usuario.isAtivo) throw new Error("Aluno não encontrado");
  if (usuario.role !== "aluno") throw new Error("Usuário não é aluno");
  return usuario;
}

// Lista todos os alunos (usuários com role "aluno")
export async function listarAlunos(): Promise<Usuario[]> {
  const response = await fetch(`${BASE_URL}`);
  if (!response.ok) throw new Error("Erro ao buscar alunos");
  return response.json();
}

export async function excluirAluno(id: string | number): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir aluno");
}