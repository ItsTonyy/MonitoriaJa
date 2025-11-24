import { API } from "../../../config/api";

const BASE_URL = `${API.URL}/upload`;

export async function uploadArquivo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(BASE_URL, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Erro ao fazer upload do arquivo");
  return "http://localhost:3001/uploads/" + (await response.json()).filename;
}