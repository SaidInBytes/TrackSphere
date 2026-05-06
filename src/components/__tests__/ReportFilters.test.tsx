import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReportFilters } from '../ReportFilters';

const baseProps = {
  dateRange: { from: '', to: '' },
  onChange: vi.fn(),
  totalVisible: 7,
  totalAll: 10,
};

describe('ReportFilters', () => {
  it('renders From and To date inputs', () => {
    render(<ReportFilters {...baseProps} />);
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
  });

  it('displays visible and total counts', () => {
    render(<ReportFilters {...baseProps} />);
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('does not show Clear button when no filter is active', () => {
    render(<ReportFilters {...baseProps} />);
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('shows Clear button when a filter is active', () => {
    render(<ReportFilters {...baseProps} dateRange={{ from: '2024-01-01', to: '' }} />);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('calls onChange with empty strings when Clear is clicked', () => {
    const onChange = vi.fn();
    render(
      <ReportFilters
        {...baseProps}
        dateRange={{ from: '2024-01-01', to: '' }}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText('Clear'));
    expect(onChange).toHaveBeenCalledWith({ from: '', to: '' });
  });

  it('calls onChange with updated from date', () => {
    const onChange = vi.fn();
    render(<ReportFilters {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('From'), { target: { value: '2024-11-01' } });
    expect(onChange).toHaveBeenCalledWith({ from: '2024-11-01', to: '' });
  });

  it('calls onChange with updated to date', () => {
    const onChange = vi.fn();
    render(<ReportFilters {...baseProps} onChange={onChange} />);
    fireEvent.change(screen.getByLabelText('To'), { target: { value: '2024-11-30' } });
    expect(onChange).toHaveBeenCalledWith({ from: '', to: '2024-11-30' });
  });
});
