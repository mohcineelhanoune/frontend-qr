export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://qr.devura.ma/public";

async function request<T = unknown>(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("vcard_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  register: (body: { email: string; password: string; name: string }) =>
    request<{ ok: boolean }>("/api/register.php", { method: "POST", body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    request<{ ok: boolean; token: string; user: { id: number; name: string; email: string } }>("/api/login.php", { method: "POST", body: JSON.stringify(body) }),
  listCards: () => request<{ items: unknown[] }>("/api/cards.php"),
  createCard: (body: Record<string, unknown>) => request<{ ok: boolean; id: number }>("/api/cards.php", { method: "POST", body: JSON.stringify(body) }),
  getCard: (id: number) => request<{ item: Card }>(`/api/cards.php?id=${id}`),
  updateCard: (id: number, body: Record<string, unknown>) => request<{ ok: boolean }>(`/api/cards.php?id=${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteCard: (id: number) => request<{ ok: boolean }>(`/api/cards.php?id=${id}`, { method: "DELETE" }),
};
import type { Card } from "@/types";
