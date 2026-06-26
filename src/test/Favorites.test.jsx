import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { createStore } from 'redux';
import BookCard from '../components/BookCard';
import favoritesReducer from '../redux/reducer';

function renderWithStore(ui) {
  const store = createStore((state = { favorites: [] }, action) => ({ favorites: favoritesReducer(state.favorites, action) }));
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
}

describe('Favorites flow', () => {
  it('adds and removes a favorite from the card', async () => {
    const user = userEvent.setup();
    renderWithStore(<BookCard book={{ id: '1', title: 'Dune', authors: ['Frank Herbert'], description: '', thumbnail: '', categories: [], publishedDate: '', pageCount: null, publisher: '', language: '', previewLink: '', infoLink: '', averageRating: 4, ratingsCount: 10 }} />);

    const button = screen.getByRole('button', { name: /add .* to favorites/i });
    await user.click(button);

    expect(screen.getByRole('button', { name: /remove .* from favorites/i })).toBeInTheDocument();
  });
});
