import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EditReportModal } from '../../components/EditReportModal';
import type { Report } from '../../types/report';

const REPORT: Report = {
  id: '1',
  title: 'Original title',
  description: 'Original description',
  status: 'open',
  priority: 'medium',
  category: 'Bug',
  location: 'Stockholm',
  createdBy: 'Alice',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('EditReportModal', () => {
  it('renders with pre-filled title', () => {
    render(<EditReportModal report={REPORT} onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByDisplayValue('Original title')).toBeInTheDocument();
  });

  it('renders with pre-filled description', () => {
    render(<EditReportModal report={REPORT} onSave={vi.fn()} onClose={vi.fn()} />);
    expect(screen.getByDisplayValue('Original description')).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', () => {
    const onClose = vi.fn();
    render(<EditReportModal report={REPORT} onSave={vi.fn()} onClose={onClose} />);
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onSave with updated values on submit', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<EditReportModal report={REPORT} onSave={onSave} onClose={vi.fn()} />);

    fireEvent.change(screen.getByDisplayValue('Original title'), {
      target: { value: 'Updated title' },
    });
    fireEvent.click(screen.getByText('Save changes'));

    await waitFor(() => expect(onSave).toHaveBeenCalledOnce());
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Updated title' }));
  });

  it('shows success state after save', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<EditReportModal report={REPORT} onSave={onSave} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Save changes'));
    await waitFor(() => expect(screen.getByText('Report updated!')).toBeInTheDocument());
  });

  it('shows error when save fails', async () => {
    const onSave = vi.fn().mockRejectedValue(new Error('Server error'));
    render(<EditReportModal report={REPORT} onSave={onSave} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('Save changes'));
    await waitFor(() => expect(screen.getByText('Server error')).toBeInTheDocument());
  });
});
