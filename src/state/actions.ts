import {
  SIGN_IN_GOOGLE_AUTH,
  SET_IMPORTED_RECIPE,
  ENABLE_LOADER,
  DISABLE_LOADER,
  SET_RECIPE_VIEW_MODE,
  SET_RECIPE_BOOK_VIEW_MODE,
  SET_REDIRECT_URL,
} from './action-types';
import { RecipeBase } from '../models/interfaces';

export const signInGoogleAuth = (googleId: string, googleAuth: string) => {
  return {
    type: SIGN_IN_GOOGLE_AUTH,
    payload: {
      googleAuth,
      googleId,
    },
  };
};

export const setImportedRecipe = (recipe: RecipeBase | null) => {
  return {
    type: SET_IMPORTED_RECIPE,
    payload: recipe,
  };
};

export const enableLoader = () => {
  return {
    type: ENABLE_LOADER,
  };
};

export const disableLoader = () => {
  return {
    type: DISABLE_LOADER,
  };
};

export const setRecipeViewMode = (mode: 'default' | 'index') => {
  return {
    type: SET_RECIPE_VIEW_MODE,
    payload: mode,
  };
};

export const setRecipeBookViewMode = (mode: 'default' | 'minimal') => {
  return {
    type: SET_RECIPE_BOOK_VIEW_MODE,
    payload: mode,
  };
};

export const setRedirectUrl = (url: string) => {
  return {
    type: SET_REDIRECT_URL,
    payload: url,
  };
};
