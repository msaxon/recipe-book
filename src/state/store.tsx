import { useReducer, createContext } from 'react';
import { SET_IMPORTED_RECIPE, REMOVE_IMPORTED_RECIPE } from './action-types';
import {
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
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);
  const value: IStoreValue = {
    state,
    dispatch,
  };

  // prettier-ignore
  // @ts-ignore
  return (<Store.Provider value={value}>{children}</Store.Provider>);
}
