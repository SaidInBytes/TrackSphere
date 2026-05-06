import type { Report, CreateReportPayload } from '../types/report';

// Base URL — reads from Vite env variable, falls back to localhost:3001
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  // 204 No Content has no body
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const reportApi = {
  getReports(): Promise<Report[]> {
    return fetch(`${BASE_URL}/reports`).then((r) => handleResponse<Report[]>(r));
  },

  getReportById(id: string): Promise<Report> {
    return fetch(`${BASE_URL}/reports/${id}`).then((r) => handleResponse<Report>(r));
  },

  createReport(payload: CreateReportPayload): Promise<Report> {
    return fetch(`${BASE_URL}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => handleResponse<Report>(r));
  },

  updateReport(id: string, payload: Partial<CreateReportPayload>): Promise<Report> {
    return fetch(`${BASE_URL}/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => handleResponse<Report>(r));
  },

  deleteReport(id: string): Promise<void> {
    return fetch(`${BASE_URL}/reports/${id}`, {
      method: 'DELETE',
    }).then((r) => handleResponse<void>(r));
  },
};
