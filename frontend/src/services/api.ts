import { API } from "../config/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

async function request<T>(path: string, options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
  const url = `${API.URL}${path}`;
  const { method = "GET", body, headers } = options;
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  };
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }
  const resp = await fetch(url, config);
  const contentType = resp.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await resp.json() : (await resp.text() as any);
  if (!resp.ok) {
    throw new Error(typeof data === "string" ? data : data?.message || `Erro ${resp.status}`);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: any) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: any) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body: any) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export type { HttpMethod };