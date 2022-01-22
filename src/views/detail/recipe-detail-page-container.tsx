import React, { useContext } from 'react';
import RecipeDetailPage from './recipe-detail-page';
import RecipeDetailIndexCard from './recipe-detail-index-card';
import { useStore } from '../../utils/hooks/useStore';
import useSearchQuery from '../../utils/hooks/useSearchQuery';
import { getAllUserRecipes, getSingleRecipe } from '../../aws/dynamo-facade';
import { useQuery } from 'react-query';
import {
  GET_RECIPE_BY_ID,
  GET_RECIPE_IDS_BY_USER,
} from '../../utils/constants';
import AsyncLoader from '../shared/interstitial/async-loader';
import { AuthContext, RecipeContext } from '../../App';

export default function RecipeDetailPageContainer() {
  const { recipeViewMode } = useContext(RecipeContext);
  const { googleAuth, googleId: userId } = useContext(AuthContext);
  const recipeId = useSearchQuery().get('recipeId');

  const {
    data: recipe,
    isLoading: recipeLoading,
    isError: recipeError,
  } = useQuery(
    [GET_RECIPE_BY_ID, recipeId],
    () => getSingleRecipe(recipeId || '', googleAuth),
    {
      enabled: !!recipeId,
    }
  );

  const {
    data: userRecipeIds,
    isLoading: recipesLoading,
    isError: recipesError,
  } = useQuery([GET_RECIPE_IDS_BY_USER, userId], () =>
    getAllUserRecipes(userId, googleAuth)
  );

  if (recipeLoading || recipeLoading) {
    return <AsyncLoader />;
  } else if (recipeError || recipesError || !recipe) {
    return <p>An error occurred loading the recipe.</p>;
  }

  if (recipeViewMode === 'index') {
    return <RecipeDetailIndexCard recipe={recipe} />;
  } else {
    return (
      <RecipeDetailPage
        recipe={recipe}
        userRecipeIds={userRecipeIds?.map((uri) => uri.recipeId) || []}
      />
    );
  }
}
