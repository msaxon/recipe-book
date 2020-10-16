import React, { useState, useEffect } from 'react';
import qs from 'qs';
import RecipeDetailPage from './recipe-detail-page';
import RecipeDetailIndexCard from './recipe-detail-index-card';
import { getSingleRecipe, getAllUserRecipeIds } from '../../importer/persistance';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { setUserRecipeIds } from '../../state/actions';

export default function RecipeDetailPageContainer(props) {
    const [recipe, setRecipe] = useState(null);
    const { googleAuth, googleId, recipeViewMode, recipes, userRecipeIds } = useStore();
    const recipeId = qs.parse(props.location.search, { ignoreQueryPrefix: true }).recipeId;

    const dispatch = useDispatch();

    useEffect(() => {
        async function getRecipe(recipeId, googleAuth) {
            setRecipe(await getSingleRecipe(recipeId, googleAuth));
        }

        async function getUserRecipeIds() {
            dispatch(setUserRecipeIds(await getAllUserRecipeIds(googleId, googleAuth)));
        }

        const recipeInState = recipes && recipes.filter(r => r.recipeId === recipeId)[0];
        if(recipeInState !== null) {
            setRecipe(recipeInState);
        } else if (recipeId && googleAuth) {
            getRecipe(recipeId, googleAuth);
        } else {
            console.error('THERE NEEDS TO BE A RECIPE ID AND AUTH');
        }

        if(userRecipeIds == null) {
            getUserRecipeIds();
        }
    }, [recipeId, googleId, googleAuth]);

    if (recipe === null || userRecipeIds === null) {
        return <div>Loading...</div>;
    }

    if (recipeViewMode === 'index') {
        return <RecipeDetailIndexCard recipe={recipe} />;
    } else {
        return <RecipeDetailPage recipe={recipe} userRecipeIds={userRecipeIds} />;
    }
}
