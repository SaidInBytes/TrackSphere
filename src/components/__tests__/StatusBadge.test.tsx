import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge, PriorityBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('renders Open', () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
  it('renders In Progress', () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });
  it('renders Closed', () => {
    render(<StatusBadge status="closed" />);
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
  it('applies red colour for open', () => {
    render(<StatusBadge status="open" />);
    expect(screen.getByText('Open').className).toContain('text-red-400');
  });
  it('applies green colour for closed', () => {
    render(<StatusBadge status="closed" />);
    expect(screen.getByText('Closed').className).toContain('text-emerald-400');
  });
  it('applies amber colour for in-progress', () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText('In Progress').className).toContain('text-amber-400');
  });
});

describe('PriorityBadge', () => {
  it('renders Low', () => { render(<PriorityBadge priority="low" />); expect(screen.getByText('Low')).toBeInTheDocument(); });
  it('renders Medium', () => { render(<PriorityBadge priority="medium" />); expect(screen.getByText('Medium')).toBeInTheDocument(); });
  it('renders High', () => { render(<PriorityBadge priority="high" />); expect(screen.getByText('High')).toBeInTheDocument(); });
  it('renders Critical', () => { render(<PriorityBadge priority="critical" />); expect(screen.getByText('Critical')).toBeInTheDocument(); });
});
