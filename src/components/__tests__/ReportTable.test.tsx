import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReportTable } from '../ReportTable';
import type { Report } from '../../types/report';

const reports: Report[] = [
  {
    id: '1',
    title: 'Alpha bug',
    description: 'desc',
    status: 'open',
    priority: 'high',
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-01T08:00:00Z',
    createdBy: 'Alice',
    category: 'Bug',
    location: 'Stockholm',
  },
  {
    id: '2',
    title: 'Beta feature',
    description: 'desc',
    status: 'closed',
    priority: 'low',
    createdAt: '2024-11-05T08:00:00Z',
    updatedAt: '2024-11-05T08:00:00Z',
    createdBy: 'Bob',
    category: 'Feature',
    location: 'Gothenburg',
  },
  {
    id: '3',
    title: 'Gamma task',
    description: 'desc',
    status: 'in-progress',
    priority: 'critical',
    createdAt: '2024-11-03T08:00:00Z',
    updatedAt: '2024-11-03T08:00:00Z',
    createdBy: 'Clara',
    category: 'Security',
    location: 'Malmo',
  },
];

describe('ReportTable', () => {
  it('renders all column headers', () => {
    render(<ReportTable reports={reports} />);
    ['Title', 'Category', 'Status', 'Location', 'Date', 'Reporter'].forEach((col) => {
      expect(screen.getByText(col)).toBeInTheDocument();
    });
  });

  it('renders a row for each report', () => {
    render(<ReportTable reports={reports} />);
    expect(screen.getByText('Alpha bug')).toBeInTheDocument();
    expect(screen.getByText('Beta feature')).toBeInTheDocument();
    expect(screen.getByText('Gamma task')).toBeInTheDocument();
  });

  it('shows the empty-state message when no reports provided', () => {
    render(<ReportTable reports={[]} />);
    expect(screen.getByText('No reports match the current filters.')).toBeInTheDocument();
  });

  it('displays status badges correctly', () => {
    render(<ReportTable reports={reports} />);
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByText('Closed')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('displays location for each report', () => {
    render(<ReportTable reports={reports} />);
    expect(screen.getByText('Stockholm')).toBeInTheDocument();
    expect(screen.getByText('Gothenburg')).toBeInTheDocument();
    expect(screen.getByText('Malmo')).toBeInTheDocument();
  });

  it('displays reporter names', () => {
    render(<ReportTable reports={reports} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Clara')).toBeInTheDocument();
  });

  it('shows row count in footer', () => {
    render(<ReportTable reports={reports} />);
    expect(screen.getByText('3 reports')).toBeInTheDocument();
  });

  it('uses singular "report" for a single row', () => {
    render(<ReportTable reports={[reports[0]]} />);
    expect(screen.getByText('1 report')).toBeInTheDocument();
  });

  it('sorts by title ascending when Title header clicked', () => {
    render(<ReportTable reports={reports} />);
    fireEvent.click(screen.getByText('Title'));
    const rows = screen.getAllByRole('row').slice(1); // skip header
    expect(rows[0]).toHaveTextContent('Alpha bug');
    expect(rows[1]).toHaveTextContent('Beta feature');
    expect(rows[2]).toHaveTextContent('Gamma task');
  });

  it('toggles sort direction on second click', () => {
    render(<ReportTable reports={reports} />);
    fireEvent.click(screen.getByText('Title'));
    fireEvent.click(screen.getByText('Title'));
    const rows = screen.getAllByRole('row').slice(1);
    expect(rows[0]).toHaveTextContent('Gamma task');
  });
});
