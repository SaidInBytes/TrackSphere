import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getReports,
  saveReports,
  addReport,
  updateReport,
  deleteReport,
} from '../reportStorage';
import { mockReports } from '../../data/mockReports';
import type { Report } from '../../types/report';

 localStorage mock // 
const store: Record<string, string> = {};
const localStorageMock = {
  getItem:  (key: string) => store[key] ?? null,
  setItem:  (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear:    () => { Object.keys(store).forEach((k) => delete store[k]); },
};
vi.stubGlobal('localStorage', localStorageMock);

const SAMPLE: Report = {
  id: 'test-1',
  title: 'Test report',
  description: 'A test',
  status: 'open',
  priority: 'medium',
  createdAt: '2024-11-01T08:00:00Z',
  updatedAt: '2024-11-01T08:00:00Z',
  createdBy: 'Tester',
  category: 'Bug',
  location: 'Stockholm',
};

describe('reportStorage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

 getReports   // 
  describe('getReports', () => {
    it('seeds localStorage with mockReports on first call', () => {
      const result = getReports();
      expect(result).toEqual(mockReports);
      expect(localStorage.getItem('tracksphere_reports')).not.toBeNull();
    });

    it('returns previously saved reports on subsequent calls', () => {
      saveReports([SAMPLE]);
      const result = getReports();
      expect(result).toEqual([SAMPLE]);
    });

    it('falls back to mockReports when localStorage contains invalid JSON', () => {
      store['tracksphere_reports'] = 'not-valid-json{{';
      const result = getReports();
      expect(result).toEqual(mockReports);
    });
  });

 saveReports   // 
  describe('saveReports', () => {
    it('persists the reports array to localStorage', () => {
      saveReports([SAMPLE]);
      const raw = localStorage.getItem('tracksphere_reports');
      expect(JSON.parse(raw!)).toEqual([SAMPLE]);
    });

    it('overwrites any previously saved data', () => {
      saveReports([SAMPLE]);
      saveReports([]);
      const raw = localStorage.getItem('tracksphere_reports');
      expect(JSON.parse(raw!)).toEqual([]);
    });
  });

 addReport   // 
  describe('addReport', () => {
    it('prepends the new report to the list', () => {
      saveReports([SAMPLE]);
      const second: Report = { ...SAMPLE, id: 'test-2', title: 'Second' };
      const result = addReport(second);
      expect(result[0]).toEqual(second);
      expect(result[1]).toEqual(SAMPLE);
    });

    it('persists the updated list to localStorage', () => {
      saveReports([]);
      addReport(SAMPLE);
      const stored = getReports();
      expect(stored).toEqual([SAMPLE]);
    });

    it('returns the full updated list', () => {
      saveReports([SAMPLE]);
      const second: Report = { ...SAMPLE, id: 'test-2' };
      const result = addReport(second);
      expect(result).toHaveLength(2);
    });
  });

 updateReport   // 
  describe('updateReport', () => {
    it('updates the matching report by id', () => {
      saveReports([SAMPLE]);
      const result = updateReport('test-1', { title: 'Updated title' });
      expect(result[0].title).toBe('Updated title');
    });

    it('sets updatedAt to a new timestamp', () => {
      saveReports([SAMPLE]);
      const before = SAMPLE.updatedAt;
      const result = updateReport('test-1', { status: 'closed' });
      expect(result[0].updatedAt).not.toBe(before);
    });

    it('does not modify other reports', () => {
      const other: Report = { ...SAMPLE, id: 'other', title: 'Other' };
      saveReports([SAMPLE, other]);
      updateReport('test-1', { title: 'Changed' });
      const stored = getReports();
      expect(stored.find((r) => r.id === 'other')?.title).toBe('Other');
    });

    it('returns unchanged list when id is not found', () => {
      saveReports([SAMPLE]);
      const result = updateReport('non-existent', { title: 'x' });
      expect(result).toEqual([SAMPLE]);
    });
  });

 deleteReport   // 
  describe('deleteReport', () => {
    it('removes the report with the given id', () => {
      saveReports([SAMPLE]);
      const result = deleteReport('test-1');
      expect(result).toHaveLength(0);
    });

    it('persists the deletion to localStorage', () => {
      saveReports([SAMPLE]);
      deleteReport('test-1');
      expect(getReports()).toHaveLength(0);
    });

    it('does not remove other reports', () => {
      const other: Report = { ...SAMPLE, id: 'keep-me' };
      saveReports([SAMPLE, other]);
      deleteReport('test-1');
      const stored = getReports();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('keep-me');
    });

    it('returns unchanged list when id is not found', () => {
      saveReports([SAMPLE]);
      const result = deleteReport('non-existent');
      expect(result).toEqual([SAMPLE]);
    });
  });
});
