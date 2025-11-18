import { API } from "../config/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

async function request<T>(
  path: string,
  options: { method?: HttpMethod; body?: any; headers?: Record<string, string>; timeoutMs?: number } = {}
): Promise<T> {
  const url = `${API.URL}${path}`;
  const { method = "GET", body, headers, timeoutMs = 15000 } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    signal: controller.signal,
  };
  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  try {
    const resp = await fetch(url, config);
    clearTimeout(timeoutId);
    const contentType = resp.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await resp.json() : (await resp.text() as any);
    if (!resp.ok) {
      const msg = typeof data === "string" ? data : data?.message || `Erro ${resp.status}`;
      throw new Error(msg);
    }
    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err?.name === "AbortError") {
      throw new Error("Tempo de requisição excedido");
    }
    throw new Error("Falha ao comunicar com o servidor");
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: any) => request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body: any) => request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body: any) => request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export type { HttpMethod };
