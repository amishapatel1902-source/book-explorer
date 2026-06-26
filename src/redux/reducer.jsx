import { ADD_FAVORITE, REMOVE_FAVORITE } from './actions';

const initialState = [];

export default function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_FAVORITE: {
      if (state.some((book) => book.id === action.payload.id)) return state;
      return [{ ...action.payload }, ...state];
    }
    case REMOVE_FAVORITE:
      return state.filter((book) => book.id !== action.payload);
    default:
      return state;
  }
}
