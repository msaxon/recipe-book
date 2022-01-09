import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import RecipeBookCard from './recipe-book-card';
import { Recipe } from '../../models/interfaces';
import './recipe-book-page.scss';

interface IProps {
  userRecipes: Recipe[];
  hasMore: boolean;
  fetchNextPage: () => void;
}

export default function RecipeBook({
  userRecipes,
  hasMore,
  fetchNextPage,
}: IProps) {
  if (userRecipes === undefined) {
    console.log('it is now undefined');
    return <p>...loading</p>;
  }
  return (
    <InfiniteScroll pageStart={0} hasMore={hasMore} loadMore={fetchNextPage}>
      <div className="recipe-card-wrapper">
        {userRecipes.map((recipe) => {
          return (
            <div key={recipe.recipeId}>
              <RecipeBookCard recipe={recipe} />
            </div>
          );
        })}
      </div>
    </InfiniteScroll>
  );
}
