import React, { useContext } from 'react';
import RecipeDetailPage from './recipe-detail-page';
import RecipeDetailIndexCard from './recipe-detail-index-card';
import { useStore } from '../../utils/hooks/useStore';
import useSearchQuery from '../../utils/hooks/useSearchQuery';
import { getSingleRecipe } from '../../aws/dynamo-facade';
import { useQuery } from 'react-query';
import { GET_RECIPE_BY_ID } from '../../utils/constants';
import AsyncLoader from '../shared/interstitial/async-loader';
import { AuthContext } from '../../App';

export default function RecipeDetailPageContainer() {
  const { recipeViewMode, userRecipeIds } = useStore();
  const { googleAuth } = useContext(AuthContext);
  const recipeId = useSearchQuery().get('recipeId');

  const {
    data: recipe,
    isLoading,
    isError,
  } = useQuery(
    [GET_RECIPE_BY_ID, recipeId],
    () => getSingleRecipe(recipeId || '', googleAuth),
    {
      enabled: !!recipeId,
    }
  );

  if (isLoading) {
    return <AsyncLoader />;
  } else if (isError || !recipe) {
    return <p>An error occurred loading the recipe.</p>;
  }

  if (recipeViewMode === 'index') {
    return <RecipeDetailIndexCard recipe={recipe} />;
  } else {
    return (
      <RecipeDetailPage recipe={recipe} userRecipeIds={userRecipeIds || []} />
    );
  }
}
