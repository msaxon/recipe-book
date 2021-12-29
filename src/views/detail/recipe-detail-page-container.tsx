import React, { useState, useEffect } from 'react';
import RecipeDetailPage from './recipe-detail-page';
import RecipeDetailIndexCard from './recipe-detail-index-card';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { setUserRecipeIds } from '../../state/actions';
import useSearchQuery from "../../utils/hooks/useSearchQuery";
import {Recipe} from "../../models/interfaces";
import {getAllUserRecipeIds, getSingleRecipe} from "../../aws/dynamo-facade";

export default function RecipeDetailPageContainer() {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const { googleAuth, googleId, recipeViewMode, recipes, userRecipeIds } = useStore();
    const recipeId = useSearchQuery().get('recipeId');

    const dispatch = useDispatch();

    useEffect(() => {
        async function getRecipe(recipeId: string, googleAuth: string) {
            setRecipe(await getSingleRecipe(recipeId, googleAuth));
        }

        async function getUserRecipeIds() {
            dispatch(setUserRecipeIds(await getAllUserRecipeIds(googleId, googleAuth)));
        }

        const recipeInState: Recipe = recipes && recipes.find(r => r.recipeId === recipeId) as Recipe;
        
        if(recipeInState !== null && recipeInState !== undefined) {
            setRecipe(recipeInState);
        } else if (recipeId && googleAuth) {
            getRecipe(recipeId, googleAuth);
        } else {
            console.error('THERE NEEDS TO BE A RECIPE ID AND AUTH');
        }

        if(userRecipeIds == null) {
            getUserRecipeIds();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipeId, googleId, googleAuth]);

    if (recipe === null || recipe === undefined || userRecipeIds === null) {
        return <div>Loading...</div>;
    }

    if (recipeViewMode === 'index') {
        return <RecipeDetailIndexCard recipe={recipe} />;
    } else {
        return <RecipeDetailPage recipe={recipe} userRecipeIds={userRecipeIds || []} />;
    }
}
