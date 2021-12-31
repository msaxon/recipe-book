import React from 'react';
import RecipeBookCard from './recipe-book-card';
import {Recipe} from "../../models/interfaces";
import './recipe-book-page.scss';

interface IProps {
    userRecipes: Recipe[]
}

export default function RecipeBook({ userRecipes }: IProps) {
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
