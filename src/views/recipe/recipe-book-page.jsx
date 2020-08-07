import React, { useState, useEffect } from 'react';
import { useStore } from '../../utils/hooks/useStore';
import RecipeBookCard from './recipe-book-card';
import { getAllUserRecipes } from '../../importer/persistance';
import './recipe-book-page.scss';

export default function RecipeBook() {
    const [userRecipes, setUserRecipes] = useState([]);
    const userId = useStore((state) => state.googleId);
    const googleAuth = useStore((state) => state.googleAuth);

    useEffect(() => {
        async function getRecipes() {
            if (userId && googleAuth) {
                const recipes = await getAllUserRecipes(userId, googleAuth);
                setUserRecipes(recipes);
            }
        }

        getRecipes();
    }, [googleAuth, userId]);
    /**
     *  sort by (fields)
     *      name
     *      website
     *  filter
     *      ingredient
     *      website
     *      origin things
     *      total times
     *  tags
     *      specific stuff here
     *  search
     *      name, steps, ingredients, tags, notes
     */

    return (
        <div>
            <div className="recipe-card-wrapper">
                {userRecipes.map((recipe) => {
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
