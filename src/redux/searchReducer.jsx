import { SEARCH_START, SEARCH_SUCCESS, SEARCH_ERROR, SEARCH_CLEAR } from './actions';

const initialState = {
  books: [],
  loading: false,
  error: null,
  totalItems: 0,
  page: 0,
  lastFields: null,
};

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_START:
      return {
        ...state,
        loading: true,
        error: null,
        // Only clear the book list when starting a fresh search (page 0),
        // keep old results visible while paginating.
        books: action.resetBooks ? [] : state.books,
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        books: action.payload.books,
        totalItems: action.payload.totalItems,
        page: action.payload.page,
        lastFields: action.payload.lastFields,
      };
    case SEARCH_ERROR:
      return { ...state, loading: false, error: action.payload };
    case SEARCH_CLEAR:
      return { ...initialState };
    default:
      return state;
  }
}
