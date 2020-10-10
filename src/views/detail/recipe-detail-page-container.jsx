import React, { useState, useEffect } from 'react';
import qs from 'qs';
import RecipeDetailPage from './recipe-detail-page';
import RecipeDetailIndexCard from './recipe-detail-index-card';
import { getSingleRecipe, getAllUserRecipeIds } from '../../importer/persistance';
import { useStore, useDispatch } from '../../utils/hooks/useStore';

export default function RecipeDetailPageContainer(props) {
    const [recipe, setRecipe] = useState(null);
    const [userRecipeIds, setUserRecipeIds] = useState(null);
    const [serviceCallError, setServiceCallError] = useState(false);
    const { googleAuth, googleId, recipeViewMode } = useStore();
    const dispatch = useDispatch();
    const recipeId = qs.parse(props.location.search, { ignoreQueryPrefix: true }).recipeId;

    useEffect(() => {
        async function getRecipe(recipeId, googleAuth) {
            //have a failure scenario here
            setRecipe(await getSingleRecipe(recipeId, googleAuth));
            setUserRecipeIds(await getAllUserRecipeIds(googleId, googleAuth));
        }

        if (recipeId && googleAuth) {
            getRecipe(recipeId, googleAuth);
        } else {
            console.error('THERE NEEDS TO BE A RECIPE ID AND AUTH');
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
