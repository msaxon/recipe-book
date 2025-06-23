import { useEffect, useState } from 'react';

import { useQuery } from 'react-query';

import { InputLabel, Select, TextInput } from '@mantine/core';
import FeatherIcon from 'feather-icons-react';

import { getAllUserRecipes } from '../../aws/dynamo-facade';
import { useAuthContext } from '../../context/auth-context.tsx';
import { useRecipeContext } from '../../context/recipe-context.tsx';
import useSearchQuery from '../../hooks/useSearchQuery';
import type { Recipe } from '../../models/interfaces';
import { firstContainsAllOfSecond } from '../../utils/array-utils';
import { GET_RECIPE_IDS_BY_USER } from '../../utils/constants';
import MultiTextInput from '../shared/input/multi-text-input';
import RecipeBookMinimal from './recipe-book-minimal';
import RecipeBookPage from './recipe-book-page';

import './recipe-book-page.scss';

export default function RecipeBookContainer() {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recipeName_asc');
  // eslint-disable-next-line prefer-const
  let { googleId: userId, googleAuth } = useAuthContext();
  const { recipeBookViewMode, setShowLoading } = useRecipeContext();
  const userIdFromQueryString = useSearchQuery().get('userId');

  if (userIdFromQueryString) {
    userId = userIdFromQueryString;
  }

  const {
    data: recipes,
    isLoading,
    isError,
  } = useQuery([GET_RECIPE_IDS_BY_USER, userId], () =>
    getAllUserRecipes(userId, googleAuth)
  );

  useEffect(() => {
    setShowLoading(isLoading);
  }, [isLoading]);

  const sortRecipes = (recipes: Recipe[]) => {
    const lowerSearch = search.toLowerCase();

    const filteredRecipes = recipes.filter((recipe) => {
      const matchesTags = firstContainsAllOfSecond(recipe.tags || [], tags);

      const matchesSearch =
        (recipe.recipeName &&
          recipe.recipeName.toLowerCase().includes(lowerSearch)) ||
        (recipe.notes && recipe.notes.toLowerCase().includes(lowerSearch)) ||
        (typeof recipe.steps === 'string' &&
          recipe.steps.toLowerCase().includes(lowerSearch)) ||
        (typeof recipe.ingredients === 'string' &&
          recipe.ingredients.toLowerCase().includes(lowerSearch));

      return matchesTags && matchesSearch;
    });

    const sortFunc = sortOptions.find((s) => s.value === sort);
    return sortFunc
      ? [...filteredRecipes].sort(sortFunc.func) // spread to avoid mutating original
      : filteredRecipes;
  };

  const sortOptions = [
    {
      value: 'recipeName_asc',
      label: 'Recipe Name: Asc',
      func: (a: Recipe, b: Recipe) =>
        a.recipeName.toLowerCase().localeCompare(b.recipeName.toLowerCase()),
    },
    {
      value: 'recipeName_desc',
      label: 'Recipe Name: Desc',
      func: (a: Recipe, b: Recipe) =>
        b.recipeName.toLowerCase().localeCompare(a.recipeName.toLowerCase()),
    },
    {
      value: 'activeTimeMinutes_lth',
      label: 'Active Time: Low to High',
      func: (a: Recipe, b: Recipe) =>
        (a.activeTimeMinutes || 0) - (b.activeTimeMinutes || 0),
    },
    {
      value: 'activeTimeMinutes_htl',
      label: 'Active Time: High to Low',
      func: (a: Recipe, b: Recipe) =>
        (b.activeTimeMinutes || 0) - (a.activeTimeMinutes || 0),
    },
    {
      value: 'totalTimeMinutes_lth',
      label: 'Total Time: Low to High',
      func: (a: Recipe, b: Recipe) =>
        (a.totalTimeMinutes || 0) - (b.totalTimeMinutes || 0),
    },
    {
      value: 'totalTimeMinutes_htl',
      label: 'Total Time: High to Low',
      func: (a: Recipe, b: Recipe) =>
        (b.totalTimeMinutes || 0) - (a.totalTimeMinutes || 0),
    },
  ];

  if (isLoading) {
    return <></>;
  } else if (isError || !recipes) {
    return <p>There was an error fetching the recipes.</p>;
  }

  if (recipeBookViewMode === 'minimal') {
    return (
      <div>
        <div className="row filter-section">
          <div className="col-12 col-lg-3">
            <TextInput
              leftSection={<FeatherIcon icon="search" />}
              label="Search"
              // placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-lg-4">
            <Select
              placeholder="Sort By"
              data={sortOptions.map((so) => ({
                value: so.value,
                label: so.label,
              }))}
              onChange={(_, d) => setSort(d.value as string)}
            />
          </div>
          <div className="col-12 col-lg-4">
            {/* @ts-expect-error its right i promise */}
            <MultiTextInput onChange={setTags} />
          </div>
          {userIdFromQueryString ? <p>Viewing Someone Else's Recipes</p> : null}
        </div>
        <RecipeBookMinimal recipes={sortRecipes(recipes)} />
      </div>
    );
  } else {
    return (
      <div>
        <div className="row filter-section">
          <div className="col-12 col-lg-4">
            <TextInput
              leftSection={<FeatherIcon icon="search" />}
              placeholder="Search..."
              label="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-lg-3">
            <Select
              placeholder="Sort By"
              data={sortOptions}
              label="Sort By"
              onChange={(_, d) => setSort(d.value as string)}
            />
          </div>
          <div className="col-12 col-lg-4">
            <InputLabel>Tags</InputLabel>
            {/* @ts-expect-error its the right type i promise */}
            <MultiTextInput onChange={setTags} />
          </div>
        </div>
        <div>
          {userIdFromQueryString ? <p>Viewing Someone Else's Recipes</p> : null}
        </div>
        <RecipeBookPage userRecipes={sortRecipes(recipes)} />
      </div>
    );
  }
}
