import { splitArrayIntoChunks } from '../utils/array-utils';
import { v4 as uuidv4 } from 'uuid';

import { Recipe, RecipeBase, User } from '../models/interfaces';
import {
  deleteRecipeActual,
  getRecipeById,
  getRecipeIdsByUser,
  getRecipesByIdList,
  getUsers,
  postRecipe,
  postRecipeUserRelationship,
} from './dynamo';
import {
  dbResponseToRecipe,
  dbResponseToRecipeIds,
  dbResponseToRecipeList,
  dbResponseToUsers,
} from './dynamo-utils';

export const getAllUserRecipes = async (
  userId: string,
  accessToken: string
): Promise<Recipe[]> => {
  //get recipeIds
  const recipeIdResponse = await getRecipeIdsByUser(userId, accessToken);
  const recipeIds = dbResponseToRecipeIds(recipeIdResponse.Items?.[0]);
  const recipeIdArrays = splitArrayIntoChunks(recipeIds, 100);

  //get lists
  let recipes: Recipe[] = [];
  for (let i = 0; i < recipeIdArrays.length; i++) {
    const recipeListResponse = await getRecipesByIdList(
      recipeIdArrays[i],
      accessToken
    );
    const recipeList = dbResponseToRecipeList(
      recipeListResponse.Responses?.['recipeBook-recipe']
    );
    recipes = recipes.concat(recipeList);
  }

  return Promise.resolve(recipes);
};

export const getSingleRecipe = async (
  recipeId: string,
  accessToken: string
): Promise<Recipe> => {
  const recipeResponse = await getRecipeById(recipeId, accessToken);
  return dbResponseToRecipe(recipeResponse.Item);
};

export const postNewRecipe = async (
  recipeBase: RecipeBase,
  userId: string,
  accessToken: string
): Promise<string> => {
  const recipe: Recipe = { ...recipeBase, recipeId: uuidv4() };

  //post the recipe
  await postRecipe(recipe, accessToken);

  await putNewRecipeRelationship(
    userId,
    recipe.recipeId as string,
    accessToken
  );

  return recipe.recipeId as string;
};

export const updateRecipe = async (
  recipe: Recipe,
  userId: string,
  accessToken: string
): Promise<string> => {
  const storedRecipe = await getSingleRecipe(recipe.recipeId, accessToken);

  if (storedRecipe.origin.ownerId === userId) {
    await postRecipe(recipe, accessToken);
    return storedRecipe.recipeId;
  } else {
    return Promise.reject('You do not have permission to update this recipe.');
  }
};

export const deleteRecipeRelationship = async (
  recipe: Recipe,
  userId: string,
  accessToken: string
): Promise<void> => {
  const recipeIdsResponse = await getRecipeIdsByUser(userId, accessToken);
  let recipeIds = dbResponseToRecipeIds(recipeIdsResponse.Items?.[0]);
  recipeIds = recipeIds.filter((id) => id !== recipe.recipeId);

  //update recipeIds
  await postRecipeUserRelationship(recipeIds, userId, accessToken);
};

export const deleteRecipe = async (
  recipe: Recipe,
  userId: string,
  accessToken: string
): Promise<void> => {
  await deleteRecipeRelationship(recipe, userId, accessToken);
  await deleteRecipeActual(recipe.recipeId, accessToken);
};

//TODO unused??
export const getAllUserRecipeIds = async (
  userId: string,
  accessToken: string
): Promise<string[]> => {
  const recipeIdResponse = await getRecipeIdsByUser(userId, accessToken);
  return dbResponseToRecipeIds(recipeIdResponse.Items?.[0]);
};

export const putNewRecipeRelationship = async (
  userId: string,
  recipeId: string,
  accessToken: string
) => {
  //get the user
  const recipeIdsResponse = await getRecipeIdsByUser(userId, accessToken);
  const recipeIds = dbResponseToRecipeIds(recipeIdsResponse.Items?.[0]);

  recipeIds.push(recipeId);

  //post the user
  await postRecipeUserRelationship(recipeIds, userId, accessToken);
};

export const getAllUsers = async (accessToken: string): Promise<User[]> => {
  const response = await getUsers(accessToken);
  return dbResponseToUsers(response.Items);
};
