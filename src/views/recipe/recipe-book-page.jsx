import React from 'react';
import RecipeBookCard from './recipe-book-card';
import './recipe-book-page.scss';

export default function RecipeBook({ userRecipes }) {
    console.log('here', userRecipes);
    if (userRecipes === undefined) {
        return <p>...loading</p>;
    }
    return (
        <div>
            <div className="recipe-card-wrapper">
                {userRecipes.map(recipe => {
                    return (
                        <div key={recipe.recipeId}>
                            <RecipeBookCard recipe={recipe} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
