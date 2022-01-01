import React, { useContext, useEffect, useState } from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import MultiTextInput from '../shared/input/multi-text-input';
import RecipeBookViewModeToggle from './recipe-book-toggle';
import RecipeBookPage from './recipe-book-page';
import { firstContainsAllOfSecond } from '../../utils/array-utils';
import RecipeBookMinimal from './recipe-book-minimal';
import useSearchQuery from '../../utils/hooks/useSearchQuery';
import { getAllUserRecipes } from '../../aws/dynamo-facade';
import { Recipe } from '../../models/interfaces';
import './recipe-book-page.scss';
import { useQuery } from 'react-query';
import { GET_RECIPE_IDS_BY_USER } from '../../utils/constants';
import { AuthContext, RecipeContext } from '../../App';

export default function RecipeBookContainer() {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recipeName_asc');
  let { googleId: userId } = useContext(AuthContext);
  const { googleAuth } = useContext(AuthContext);
  const { recipeBookViewMode, setShowLoading } = useContext(RecipeContext);
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
    setShowLoading(isLoading ? 'Fetching Recipes' : null);
  }, [isLoading]);

  const sortOptions = [
    {
      key: 'recipeName_asc',
      value: 'recipeName_asc',
      text: 'Recipe Name: Asc',
      func: (a: Recipe, b: Recipe) =>
        a.recipeName.toLowerCase().localeCompare(b.recipeName.toLowerCase()),
    },
    {
      key: 'recipeName_desc',
      value: 'recipeName_desc',
      text: 'Recipe Name: Desc',
      func: (a: Recipe, b: Recipe) =>
        b.recipeName.toLowerCase().localeCompare(a.recipeName.toLowerCase()),
    },
    {
      key: 'activeTimeMinutes_lth',
      value: 'activeTimeMinutes_lth',
      text: 'Active Time: Low to High',
      func: (a: Recipe, b: Recipe) =>
        (a.activeTimeMinutes || 0) - (b.activeTimeMinutes || 0),
    },
    {
      key: 'activeTimeMinutes_htl',
      value: 'activeTimeMinutes_htl',
      text: 'Active Time: High to Low',
      func: (a: Recipe, b: Recipe) =>
        (b.activeTimeMinutes || 0) - (a.activeTimeMinutes || 0),
    },
    {
      key: 'totalTimeMinutes_lth',
      value: 'totalTimeMinutes_lth',
      text: 'Total Time: Low to High',
      func: (a: Recipe, b: Recipe) =>
        (a.totalTimeMinutes || 0) - (b.totalTimeMinutes || 0),
    },
    {
      key: 'totalTimeMinutes_htl',
      value: 'totalTimeMinutes_htl',
      text: 'Total Time: High to Low',
      func: (a: Recipe, b: Recipe) =>
        (b.totalTimeMinutes || 0) - (a.totalTimeMinutes || 0),
    },
  ];

  const sortRecipes = (recipes: Recipe[]) => {
    //tags
    const taggedRecipes = recipes.filter((recipe) =>
      firstContainsAllOfSecond(recipe.tags || [], tags)
    );

    //search
    const searchedRecipes = taggedRecipes.filter((recipe) => {
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

    //sort
    const sortFunc = sortOptions.find((s) => s.key === sort);
    return sortFunc ? searchedRecipes.sort(sortFunc.func) : searchedRecipes;
  };

  if (isLoading) {
    return <></>;
  } else if (isError || !recipes) {
    return <p>There was an error fetching the recipes.</p>;
  }

  if (recipeBookViewMode === 'minimal') {
    return (
      <div>
        <div className="row filter-section">
          <div className="col-12 col-lg-1">
            <RecipeBookViewModeToggle />
          </div>
          <div className="col-12 col-lg-3">
            <Input
              icon="search"
              fluid
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-lg-4">
            <Dropdown
              placeholder="Sort By"
              fluid
              search
              selection
              options={sortOptions}
              onChange={(e, d) => setSort(d.value as string)}
            />
          </div>
          <div className="col-12 col-lg-4">
            {/* @ts-ignore */}
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
          <div className="col-12 col-lg-3">
            <Dropdown
              placeholder="Sort By"
              fluid
              search
              selection
              options={sortOptions}
              onChange={(e, d) => setSort(d.value as string)}
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
        <RecipeBookPage userRecipes={sortRecipes(recipes)} />
      </div>
    );
  }
}
