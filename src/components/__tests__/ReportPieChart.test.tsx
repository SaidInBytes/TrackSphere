import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReportPieChart } from '../ReportPieChart';
import type { DashboardStats } from '../../types/report';

describe('ReportPieChart', () => {
  it('renders the section heading', () => {
    const stats: DashboardStats = { total: 5, open: 2, closed: 2, today: 0 };
    render(<ReportPieChart stats={stats} />);
    expect(screen.getByText('Status Distribution')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    const stats: DashboardStats = { total: 5, open: 2, closed: 2, today: 0 };
    render(<ReportPieChart stats={stats} />);
    expect(screen.getByText('Based on filtered reports')).toBeInTheDocument();
  });

  it('shows the no-data message when all stats are zero', () => {
    render(<ReportPieChart stats={{ total: 0, open: 0, closed: 0, today: 0 }} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('does not show the no-data message when stats have values', () => {
    const stats: DashboardStats = { total: 3, open: 1, closed: 1, today: 0 };
    render(<ReportPieChart stats={stats} />);
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });
});
