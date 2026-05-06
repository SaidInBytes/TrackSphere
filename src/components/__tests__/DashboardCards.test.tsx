import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardCards } from '../DashboardCards';
import type { DashboardStats } from '../../types/report';

const stats: DashboardStats = { total: 10, open: 4, closed: 3, today: 2 };

describe('DashboardCards', () => {
  it('renders all four card labels', () => {
    render(<DashboardCards stats={stats} />);
    expect(screen.getByText('Total Reports')).toBeInTheDocument();
    expect(screen.getByText('Open Reports')).toBeInTheDocument();
    expect(screen.getByText('Closed Reports')).toBeInTheDocument();
    expect(screen.getByText('Reports Today')).toBeInTheDocument();
  });

  it('displays the correct stat values', () => {
    render(<DashboardCards stats={stats} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows zero values when stats are all zero', () => {
    render(<DashboardCards stats={{ total: 0, open: 0, closed: 0, today: 0 }} />);
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(4);
  });
});
