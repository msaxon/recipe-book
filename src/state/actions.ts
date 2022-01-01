import { SET_IMPORTED_RECIPE } from './action-types';
import { RecipeBase } from '../models/interfaces';

export const setImportedRecipe = (recipe: RecipeBase | null) => {
  return {
    type: SET_IMPORTED_RECIPE,
    payload: recipe,
  };
};
