import { useQuery } from 'react-query';

import { getAllUserRecipes, getSingleRecipe } from '../../aws/dynamo-facade';
import { useAuthContext } from '../../context/auth-context.tsx';
import { useRecipeContext } from '../../context/recipe-context.tsx';
import useSearchQuery from '../../hooks/useSearchQuery';
import {
  GET_RECIPE_BY_ID,
  GET_RECIPE_IDS_BY_USER,
} from '../../utils/constants';
import AsyncLoader from '../shared/interstitial/async-loader';
import RecipeDetailIndexCard from './recipe-detail-index-card';
import RecipeDetailPage from './recipe-detail-page';

export default function RecipeDetailPageContainer() {
  const { recipeViewMode } = useRecipeContext();
  const { googleAuth, googleId: userId } = useAuthContext();
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

  if (recipeLoading || recipesLoading) {
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
