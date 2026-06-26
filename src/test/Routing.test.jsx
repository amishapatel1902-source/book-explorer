import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { beforeAll, describe, expect, it } from 'vitest';
import { createStore } from 'redux';
import App from '../App';
import favoritesReducer from '../redux/reducer';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

describe('App routing', () => {
  it('renders the favorites page on the favorites route', () => {
    const store = createStore((state = { favorites: [] }, action) => ({ favorites: favoritesReducer(state.favorites, action) }));
    window.history.pushState({}, '', '/favorites');
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(screen.getByRole('heading', { name: /your favorites/i })).toBeInTheDocument();
  });
});
