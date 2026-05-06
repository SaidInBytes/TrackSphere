import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ReportDetails } from '../../pages/ReportDetails';
import * as reportApi from '../../services/reportApi';
import type { Report } from '../../types/report';

const REPORT: Report = {
  id: '42',
  title: 'Test report title',
  description: 'This is a test description.',
  status: 'open',
  priority: 'high',
  createdAt: '2024-11-01T08:30:00Z',
  updatedAt: '2024-11-02T10:00:00Z',
  createdBy: 'Alice',
  category: 'Bug',
  location: 'Stockholm',
};

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ReportDetails', () => {
  beforeEach(() => {
    vi.spyOn(reportApi, 'getReportById').mockResolvedValue(REPORT);
  });

  it('renders title', async () => {
    renderAt('/reports/42');
    await waitFor(() =>
      expect(screen.getAllByText('Test report title').length).toBeGreaterThan(0),
    );
  });
  it('renders description', async () => {
    renderAt('/reports/42');
    await waitFor(() =>
      expect(screen.getByText('This is a test description.')).toBeInTheDocument(),
    );
  });
  it('renders category', async () => {
    renderAt('/reports/42');
    await waitFor(() => expect(screen.getByText('Bug')).toBeInTheDocument());
  });
  it('renders location', async () => {
    renderAt('/reports/42');
    await waitFor(() => expect(screen.getByText('Stockholm')).toBeInTheDocument());
  });
  it('renders reporter', async () => {
    renderAt('/reports/42');
    await waitFor(() => expect(screen.getByText('Alice')).toBeInTheDocument());
  });
  it('renders status badge', async () => {
    renderAt('/reports/42');
    await waitFor(() =>
      expect(screen.getAllByText('Open').length).toBeGreaterThan(0),
    );
  });
  it('renders back button', async () => {
    renderAt('/reports/42');
    await waitFor(() => expect(screen.getByText('Back')).toBeInTheDocument());
  });
  it('shows not-found state for unknown id', async () => {
    vi.spyOn(reportApi, 'getReportById').mockRejectedValue(new Error('Not found'));
    renderAt('/reports/999');
    await waitFor(() =>
      expect(screen.getByText('Report not found')).toBeInTheDocument(),
    );
  });
  it('shows error message for unknown id', async () => {
    vi.spyOn(reportApi, 'getReportById').mockRejectedValue(new Error('Not found'));
    renderAt('/reports/999');
    await waitFor(() => expect(screen.getByText('Not found')).toBeInTheDocument());
  });
});
