import type { Report, CreateReportPayload } from '../types/report';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';
const TOKEN_KEY = 'tracksphere_token';

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function getReports(): Promise<Report[]> {
  return fetch(`${BASE_URL}/reports`, { headers: authHeaders() }).then((r) => handleResponse<Report[]>(r));
}

export function getReportById(id: string): Promise<Report> {
  return fetch(`${BASE_URL}/reports/${id}`, { headers: authHeaders() }).then((r) => handleResponse<Report>(r));
}

export function createReport(payload: CreateReportPayload): Promise<Report> {
  return fetch(`${BASE_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }).then((r) => handleResponse<Report>(r));
}

export function updateReport(id: string, payload: Partial<CreateReportPayload>): Promise<Report> {
  return fetch(`${BASE_URL}/reports/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  }).then((r) => handleResponse<Report>(r));
}

export function deleteReport(id: string): Promise<void> {
  return fetch(`${BASE_URL}/reports/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  }).then((r) => handleResponse<void>(r));
}

export const reportApi = { getReports, getReportById, createReport, updateReport, deleteReport };

