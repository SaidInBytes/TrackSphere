import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ReportDetails } from '../../pages/ReportDetails';
import * as storage from '../../utils/reportStorage';
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
    vi.spyOn(storage, 'getReports').mockReturnValue([REPORT]);
  });

  it('renders title', () => {
    renderAt('/reports/42');
    // title appears in both the nav breadcrumb and the h1
    expect(screen.getAllByText('Test report title').length).toBeGreaterThan(0);
  });
  it('renders description', () => {
    renderAt('/reports/42');
    expect(screen.getByText('This is a test description.')).toBeInTheDocument();
  });
  it('renders category', () => {
    renderAt('/reports/42');
    expect(screen.getByText('Bug')).toBeInTheDocument();
  });
  it('renders location', () => {
    renderAt('/reports/42');
    expect(screen.getByText('Stockholm')).toBeInTheDocument();
  });
  it('renders reporter', () => {
    renderAt('/reports/42');
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });
  it('renders status badge', () => {
    renderAt('/reports/42');
    expect(screen.getAllByText('Open').length).toBeGreaterThan(0);
  });
  it('renders back button', () => {
    renderAt('/reports/42');
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
  it('shows not-found state for unknown id', () => {
    renderAt('/reports/999');
    expect(screen.getByText('Report not found')).toBeInTheDocument();
  });
  it('shows missing id in not-found message', () => {
    renderAt('/reports/999');
    expect(screen.getByText(/999/)).toBeInTheDocument();
  });
});
