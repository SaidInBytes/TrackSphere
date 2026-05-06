import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateReportForm } from '../CreateReportForm';

// onSubmit is now  return resolved Promiseasync 
const mockSubmit = () => vi.fn().mockResolvedValue(undefined);

describe('CreateReportForm', () => {
  it('renders the New Report trigger button', () => {
    render(<CreateReportForm onSubmit={mockSubmit()} />);
    expect(screen.getByText('New Report')).toBeInTheDocument();
  });

  it('modal is not visible before the button is clicked', () => {
    render(<CreateReportForm onSubmit={mockSubmit()} />);
    expect(screen.queryByText('Create Report')).not.toBeInTheDocument();
  });

  it('opens the modal when the trigger button is clicked', () => {
    render(<CreateReportForm onSubmit={mockSubmit()} />);
    fireEvent.click(screen.getByText('New Report'));
    expect(screen.getByText('Create Report')).toBeInTheDocument();
  });

  it('renders all form fields when the modal is open', () => {
    render(<CreateReportForm onSubmit={mockSubmit()} />);
    fireEvent.click(screen.getByText('New Report'));
    expect(screen.getByPlaceholderText('Brief summary...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City / Area')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bug, Feature...')).toBeInTheDocument();
  });

  it('closes the modal when Cancel is clicked', () => {
    render(<CreateReportForm onSubmit={mockSubmit()} />);
    fireEvent.click(screen.getByText('New Report'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Create Report')).not.toBeInTheDocument();
  });

  it('calls onSubmit with correct payload on submit', async () => {
    const onSubmit = mockSubmit();
    render(<CreateReportForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('New Report'));

    fireEvent.change(screen.getByPlaceholderText('Brief summary...'), { target: { value: 'Test title' } });
    fireEvent.change(screen.getByPlaceholderText('Bug, Feature...'),   { target: { value: 'Bug' } });
    fireEvent.change(screen.getByPlaceholderText('City / Area'),       { target: { value: 'Stockholm' } });
    fireEvent.change(screen.getByPlaceholderText('Your name'),         { target: { value: 'Jane' } });

    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.title).toBe('Test title');
    expect(payload.category).toBe('Bug');
    expect(payload.location).toBe('Stockholm');
    expect(payload.createdBy).toBe('Jane');
  });

  it('shows success state after submit', async () => {
    render(<CreateReportForm onSubmit={mockSubmit()} />);
    fireEvent.click(screen.getByText('New Report'));
    fireEvent.change(screen.getByPlaceholderText('Brief summary...'), { target: { value: 'T' } });
    fireEvent.change(screen.getByPlaceholderText('Bug, Feature...'),   { target: { value: 'B' } });
    fireEvent.change(screen.getByPlaceholderText('City / Area'),       { target: { value: 'C' } });
    fireEvent.change(screen.getByPlaceholderText('Your name'),         { target: { value: 'N' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    await waitFor(() => expect(screen.getByText('Report created!')).toBeInTheDocument());
  });
});
