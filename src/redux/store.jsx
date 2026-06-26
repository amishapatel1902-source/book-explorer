import { createStore, combineReducers } from 'redux';
import favoritesReducer from './reducer';
import searchReducer from './searchReducer';

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  search: searchReducer,
});

const devToolsEnhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined;

export const store = createStore(rootReducer, devToolsEnhancer);
