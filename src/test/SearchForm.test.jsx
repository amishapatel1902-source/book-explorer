import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchForm from '../components/SearchForm';

describe('SearchForm', () => {
  it('shows validation when no fields are filled', async () => {
    const user = userEvent.setup();
    render(<SearchForm onSearch={vi.fn()} loading={false} />);

    await user.click(screen.getByRole('button', { name: /search for books/i }));

    expect(screen.getByText(/please fill in at least one field/i)).toBeInTheDocument();
  });

  it('calls onSearch with filled values', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchForm onSearch={onSearch} loading={false} />);

    await user.type(screen.getByLabelText(/book title/i), 'Dune');
    await user.click(screen.getByRole('button', { name: /search for books/i }));

    expect(onSearch).toHaveBeenCalledWith({ title: 'Dune', author: '', genre: '' });
  });
});
