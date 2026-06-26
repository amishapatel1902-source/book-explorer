export const ADD_FAVORITE    = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';

export function addFavorite(book) {
  return { type: ADD_FAVORITE, payload: book };
}

export function removeFavorite(bookId) {
  return { type: REMOVE_FAVORITE, payload: bookId };
}

// ── Search actions ─────────────────────────────────────────────
export const SEARCH_START   = 'SEARCH_START';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_ERROR   = 'SEARCH_ERROR';
export const SEARCH_CLEAR   = 'SEARCH_CLEAR';
