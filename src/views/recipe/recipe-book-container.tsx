import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Input } from 'semantic-ui-react';
import MultiTextInput from '../shared/input/multi-text-input';
import RecipeBookViewModeToggle from './recipe-book-toggle';
import RecipeBookPage from './recipe-book-page';
import { firstContainsAllOfSecond } from '../../utils/array-utils';
import RecipeBookMinimal from './recipe-book-minimal';
import useSearchQuery from '../../utils/hooks/useSearchQuery';
import {
  getAllUserRecipesByPage,
  PaginatedRecipeResponse,
} from '../../aws/dynamo-facade';
import { Recipe } from '../../models/interfaces';
import './recipe-book-page.scss';
import { useInfiniteQuery } from 'react-query';
import { GET_RECIPE_IDS_BY_USER } from '../../utils/constants';
import { AuthContext, RecipeContext } from '../../App';

export default function RecipeBookContainer() {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  let { googleId: userId } = useContext(AuthContext);
  const { googleAuth } = useContext(AuthContext);
  const { recipeBookViewMode, setShowLoading } = useContext(RecipeContext);
  const userIdFromQueryString = useSearchQuery().get('userId');

  if (userIdFromQueryString) {
    userId = userIdFromQueryString;
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching: isLoading,
  } = useInfiniteQuery(
    [GET_RECIPE_IDS_BY_USER + 'abc', userId],
    ({ pageParam = 0 }) => {
      return getAllUserRecipesByPage(userId, googleAuth, pageParam);
    },
    {
      getNextPageParam: (lastPage: PaginatedRecipeResponse) => {
        if (lastPage.nextPage < lastPage.totalPages) return lastPage.nextPage;
        return undefined;
      },
    }
  );

  const recipes = data?.pages.map((page) => page.results).flat();

  useEffect(() => {
    setShowLoading(isLoading ? 'Fetching Recipes' : null);
  }, [isLoading]);

  const filterRecipes = useCallback(
    (recipes: Recipe[]) => {
      //tags
      const taggedRecipes = recipes.filter((recipe) =>
        firstContainsAllOfSecond(recipe.tags || [], tags)
      );

      //search
      return taggedRecipes.filter((recipe) => {
        return (
          (recipe.recipeName &&
            recipe.recipeName.toLowerCase().includes(search.toLowerCase())) ||
          (recipe.notes &&
            recipe.notes.toLowerCase().includes(search.toLowerCase())) ||
          (recipe.steps &&
            recipe.steps.toLowerCase().includes(search.toLowerCase())) ||
          (recipe.ingredients &&
            recipe.ingredients.toLowerCase().includes(search.toLowerCase()))
        );
      });
    },
    [recipes, search, tags]
  );

  if (!recipes) {
    return <p>There was an error fetching the recipes.</p>;
  }

  if (recipeBookViewMode === 'minimal') {
    return (
      <>
        <div className="row filter-section">
          <div className="col-12 col-lg-1">
            <RecipeBookViewModeToggle />
          </div>
          <div className="col-12 col-lg-3">
            <Input
              icon="search"
              fluid
              placeholder="Search..."
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>
          <div className="col-12 col-lg-4">
            {/* @ts-ignore */}
            <MultiTextInput onChange={setTags} />
          </div>
          {userIdFromQueryString ? <p>Viewing Someone Else's Recipes</p> : null}
        </div>
        <RecipeBookMinimal
          recipes={filterRecipes(recipes)}
          hasMore={hasNextPage || false}
          fetchNextPage={fetchNextPage}
        />
      </>
    );
  } else {
    return (
      <>
        <div className="row filter-section">
          <div className="col-12 col-lg-1">
            <RecipeBookViewModeToggle />
          </div>
          <div className="col-12 col-lg-4">
            <Input
              icon="search"
              fluid
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-lg-4">
            {/* @ts-ignore */}
            <MultiTextInput onChange={setTags} />
          </div>
        </div>
        <div>
          {userIdFromQueryString ? <p>Viewing Someone Else's Recipes</p> : null}
        </div>
        <RecipeBookPage
          userRecipes={filterRecipes(recipes)}
          hasMore={hasNextPage || false}
          fetchNextPage={fetchNextPage}
        />
      </>
    );
  }
}
