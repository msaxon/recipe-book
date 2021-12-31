import React, { useState } from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import MultiTextInput from '../shared/input/multi-text-input';
import RecipeBookViewModeToggle from './recipe-book-toggle';
import RecipeBookPage from './recipe-book-page';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { firstContainsAllOfSecond } from '../../utils/array-utils';
import RecipeBookMinimal from './recipe-book-minimal';
import { setRecipes } from '../../state/actions';
import useSearchQuery from "../../utils/hooks/useSearchQuery";
import {getAllUserRecipes} from "../../aws/dynamo-facade";
import useAsyncEffect from "use-async-effect";
import {Recipe} from "../../models/interfaces";
import './recipe-book-page.scss';

export default function RecipeBookContainer() {
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('recipeName_asc');
    let { googleId: userId } = useStore();
    const { googleAuth, recipeBookViewMode, recipes: userRecipes, recipeUserId } = useStore();
    const userIdFromQueryString = useSearchQuery().get('userId');

    if(userIdFromQueryString) {
        userId = userIdFromQueryString;
    }
    
    const dispatch = useDispatch();

    useAsyncEffect(async () => {
        if (userId && googleAuth && (userRecipes === null || userIdFromQueryString || recipeUserId !== userId)) {
            const recipes = await getAllUserRecipes(userId, googleAuth);
            dispatch(setRecipes(recipes, userId));
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [googleAuth, userId]);

    const sortOptions = [
        {
            key: 'recipeName_asc',
            value: 'recipeName_asc',
            text: 'Recipe Name: Asc',
            func: (a: Recipe, b: Recipe) => a.recipeName.toLowerCase().localeCompare(b.recipeName.toLowerCase())
        },
        {
            key: 'recipeName_desc',
            value: 'recipeName_desc',
            text: 'Recipe Name: Desc',
            func: (a: Recipe, b: Recipe) => b.recipeName.toLowerCase().localeCompare(a.recipeName.toLowerCase())
        },
        {
            key: 'activeTimeMinutes_lth',
            value: 'activeTimeMinutes_lth',
            text: 'Active Time: Low to High',
            func: (a: Recipe, b: Recipe) => (a.activeTimeMinutes || 0) - (b.activeTimeMinutes || 0)
        },
        {
            key: 'activeTimeMinutes_htl',
            value: 'activeTimeMinutes_htl',
            text: 'Active Time: High to Low',
            func: (a: Recipe, b: Recipe) => (b.activeTimeMinutes || 0) - (a.activeTimeMinutes || 0)
        },
        {
            key: 'totalTimeMinutes_lth',
            value: 'totalTimeMinutes_lth',
            text: 'Total Time: Low to High',
            func: (a: Recipe, b: Recipe) => (a.totalTimeMinutes || 0) - (b.totalTimeMinutes || 0)
        },
        {
            key: 'totalTimeMinutes_htl',
            value: 'totalTimeMinutes_htl',
            text: 'Total Time: High to Low',
            func: (a: Recipe, b: Recipe) => (b.totalTimeMinutes || 0) - (a.totalTimeMinutes || 0)
        }
    ];

    const sortRecipes = (recipes: Recipe[]) => {
        //tags
        const taggedRecipes = recipes.filter(recipe => firstContainsAllOfSecond(recipe.tags || [], tags));

        //search
        const searchedRecipes = taggedRecipes.filter(recipe => {
            return (
                (recipe.recipeName && recipe.recipeName.toLowerCase().includes(search.toLowerCase())) ||
                (recipe.notes && recipe.notes.toLowerCase().includes(search.toLowerCase())) ||
                (recipe.steps && recipe.steps.toLowerCase().includes(search.toLowerCase())) ||
                (recipe.ingredients && recipe.ingredients.toLowerCase().includes(search.toLowerCase()))
            );
        });

        //sort
        const sortFunc = sortOptions.find(s => s.key === sort);
        return sortFunc ? searchedRecipes.sort(sortFunc.func) : searchedRecipes;
    };

    if(userRecipes === null) {
        return <></>;
    }

    if (recipeBookViewMode === 'minimal') {
        return (
            <div>
                <div className="row filter-section">
                    <div className="col-12 col-lg-1">
                        <RecipeBookViewModeToggle />
                    </div>
                    <div className="col-12 col-lg-3">
                        <Input icon="search" fluid placeholder="Search..." onChange={e => setSearch(e.target.value)} />
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
                <RecipeBookMinimal recipes={sortRecipes(userRecipes)} />
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
                        <Input icon="search" fluid placeholder="Search..." onChange={e => setSearch(e.target.value)} />
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
                <RecipeBookPage userRecipes={sortRecipes(userRecipes)} />
            </div>
        );
    }
}
