import type { Report } from '../types/report';
import { mockReports } from '../data/mockReports';

const STORAGE_KEY = 'tracksphere_reports';

/**
 * Load all reports from localStorage.
 * Falls back to mockReports if localStorage is empty or corrupted.
 */
export function getReports(): Report[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit — seed localStorage with mock data
      saveReports(mockReports);
      return mockReports;
    }
    return JSON.parse(raw) as Report[];
  } catch {
    // JSON parse failed — reset to mock data
    saveReports(mockReports);
    return mockReports;
  }
}

/**
 * Persist the full reports array to localStorage.
 */
export function saveReports(reports: Report[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

/**
 * Append a new report and persist.
 * Returns the updated list.
 */
export function addReport(report: Report): Report[] {
  const current = getReports();
  const updated = [report, ...current];
  saveReports(updated);
  return updated;
}

/**
 * Replace a single report by id and persist.
 * Returns the updated list (unchanged if id not found).
 */
export function updateReport(reportId: string, updatedReport: Partial<Report>): Report[] {
  const current = getReports();
  const updated = current.map((r) =>
    r.id === reportId
      ? { ...r, ...updatedReport, updatedAt: new Date().toISOString() }
      : r,
  );
  saveReports(updated);
  return updated;
}

/**
 * Remove a report by id and persist.
 * Returns the updated list.
 */
export function deleteReport(reportId: string): Report[] {
  const current = getReports();
  const updated = current.filter((r) => r.id !== reportId);
  saveReports(updated);
  return updated;
}
