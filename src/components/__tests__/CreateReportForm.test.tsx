import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateReportForm } from '../CreateReportForm';

describe('CreateReportForm', () => {
  it('renders the New Report trigger button', () => {
    render(<CreateReportForm onSubmit={vi.fn()} />);
    expect(screen.getByText('New Report')).toBeInTheDocument();
  });

  it('modal is not visible before the button is clicked', () => {
    render(<CreateReportForm onSubmit={vi.fn()} />);
    expect(screen.queryByText('Create Report')).not.toBeInTheDocument();
  });

  it('opens the modal when the trigger button is clicked', () => {
    render(<CreateReportForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByText('New Report'));
    expect(screen.getByText('Create Report')).toBeInTheDocument();
  });

  it('renders all form fields when the modal is open', () => {
    render(<CreateReportForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByText('New Report'));
    expect(screen.getByPlaceholderText('Brief summary...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City / Area')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bug, Feature...')).toBeInTheDocument();
  });

  it('closes the modal when Cancel is clicked', () => {
    render(<CreateReportForm onSubmit={vi.fn()} />);
    fireEvent.click(screen.getByText('New Report'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Create Report')).not.toBeInTheDocument();
  });

  it('calls onSubmit with correct payload and closes modal on submit', () => {
    const onSubmit = vi.fn();
    render(<CreateReportForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('New Report'));

    fireEvent.change(screen.getByPlaceholderText('Brief summary...'), {
      target: { value: 'Test title' },
    });
    fireEvent.change(screen.getByPlaceholderText('Bug, Feature...'), {
      target: { value: 'Bug' },
    });
    fireEvent.change(screen.getByPlaceholderText('City / Area'), {
      target: { value: 'Stockholm' },
    });
    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'Jane' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    expect(onSubmit).toHaveBeenCalledOnce();
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.title).toBe('Test title');
    expect(payload.category).toBe('Bug');
    expect(payload.location).toBe('Stockholm');
    expect(payload.createdBy).toBe('Jane');
    expect(screen.queryByText('Create Report')).not.toBeInTheDocument();
  });

  it('resets the form after a successful submit', () => {
    const onSubmit = vi.fn();
    render(<CreateReportForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByText('New Report'));
    fireEvent.change(screen.getByPlaceholderText('Brief summary...'), {
      target: { value: 'Filled in' },
    });
    fireEvent.change(screen.getByPlaceholderText('Bug, Feature...'), {
      target: { value: 'Bug' },
    });
    fireEvent.change(screen.getByPlaceholderText('City / Area'), {
      target: { value: 'Oslo' },
    });
    fireEvent.change(screen.getByPlaceholderText('Your name'), {
      target: { value: 'Name' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create' }));

    // Re-open and verify title field is empty
    fireEvent.click(screen.getByText('New Report'));
    expect(screen.getByPlaceholderText('Brief summary...')).toHaveValue('');
  });
});
