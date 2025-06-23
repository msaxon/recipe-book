import type { RecipeBase } from '../models/interfaces';
import { SET_IMPORTED_RECIPE } from './action-types';

export const setImportedRecipe = (recipe: RecipeBase | null) => {
  return {
    type: SET_IMPORTED_RECIPE,
    payload: recipe,
  };
};
