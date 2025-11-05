import { User } from "../login/fetch";

export async function excluirUsuario(id: number | string): Promise<User> {
  const responseGet = await fetch(`http://localhost:3001/usuarios/${id}`);
  if (!responseGet.ok) throw new Error("Usuário não encontrado");
  const usuario = await responseGet.json();
  const response = await fetch(`http://localhost:3001/usuarios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...usuario, isAtivo: false }),
  });
  if (!response.ok) throw new Error("Erro ao excluir usuário");
  return response.json();
}

export async function listarUsuariosAtivos(): Promise<User[]> {
  const response = await fetch("http://localhost:3001/usuarios?isAtivo=true");
  if (!response.ok) throw new Error("Erro ao buscar usuários");
  return response.json();
}

export async function listarAlunos(): Promise<User[]> {
  const response = await fetch("http://localhost:3001/usuarios?role=user&isAtivo=true");
  if (!response.ok) throw new Error("Erro ao buscar alunos");
  return response.json();
}