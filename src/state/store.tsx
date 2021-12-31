import { useReducer, createContext } from 'react';
import {
  SET_DARK_MODE,
  SIGN_IN_GOOGLE_AUTH,
  SIGN_OUT_GOOGLE_AUTH,
  SET_IMPORTED_RECIPE,
  REMOVE_IMPORTED_RECIPE,
  ENABLE_LOADER,
  DISABLE_LOADER,
  SET_RECIPE_VIEW_MODE,
  SET_RECIPE_BOOK_VIEW_MODE,
  SET_RECIPES,
  SET_USER_RECIPE_IDS,
  SET_REDIRECT_URL,
  UNSET_REDIRECT_URL,
} from './action-types';
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
    case SET_DARK_MODE:
      return {
        ...state,
        darkMode: action.payload,
      };
    case SIGN_IN_GOOGLE_AUTH:
      return {
        ...state,
        googleId: action.payload.googleId,
        googleAuth: action.payload.googleAuth,
        isSignedIn: true,
      };
    case SIGN_OUT_GOOGLE_AUTH:
      return {
        ...state,
        googleAuth: null,
        googleId: null,
        isSignedIn: false,
      };
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
    case ENABLE_LOADER:
      return {
        ...state,
        isLoaderActive: true,
      };
    case DISABLE_LOADER:
      return {
        ...state,
        isLoaderActive: false,
      };
    case SET_RECIPE_VIEW_MODE:
      return {
        ...state,
        recipeViewMode: action.payload,
      };
    case SET_RECIPE_BOOK_VIEW_MODE:
      return {
        ...state,
        recipeBookViewMode: action.payload,
      };
    case SET_RECIPES:
      return {
        ...state,
        recipes: action.payload.recipes,
        recipeUserId: action.payload.userId,
      };
    case SET_USER_RECIPE_IDS:
      return {
        ...state,
        userRecipeIds: action.payload,
      };
    case SET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: action.payload,
      };
    case UNSET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: null,
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
