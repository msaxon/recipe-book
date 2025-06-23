import { createContext, useReducer } from 'react';

import { REMOVE_IMPORTED_RECIPE, SET_IMPORTED_RECIPE } from './action-types';
import type {
  IAction,
  IStore,
  IStoreProviderProps,
  IStoreValue,
} from './interfaces';

const initialState = {
  darkMode: false,
  isSignedIn: false,
  isLoaderActive: false,
  recipeViewMode: 'default',
  recipeBookViewMode: 'default',
  googleAuth: '',
  googleId: '',
  redirectUrl: '',
  recipeUserId: '',
  recipes: [],
};

export const Store = createContext<IStoreValue>({
  state: initialState,
  dispatch: () => {},
});

const reducer = (state: IStore, action: IAction) => {
  switch (action.type) {
    case SET_IMPORTED_RECIPE:
      return {
        ...state,
        importedRecipe: action.payload,
      };
    case REMOVE_IMPORTED_RECIPE:
      return {
        ...state,
        importedRecipe: null,
      };
    default:
      return state;
  }
};

export function StoreProvider({ children }: IStoreProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value: IStoreValue = {
    state,
    dispatch,
  };

  // prettier-ignore
  return (<Store.Provider value={value}>{children}</Store.Provider>);
}
