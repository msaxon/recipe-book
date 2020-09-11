import React, { useState, useEffect } from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import { useStore } from '../../utils/hooks/useStore';
import { getAllUserRecipes } from '../../importer/persistance';
import { firstContainsAllOfSecond } from '../../utils/array-utils';
import RecipeBookCard from './recipe-book-card';
import MultiTextInput from '../shared/input/multi-text-input';
import './recipe-book-page.scss';

export default function RecipeBook() {
    const [userRecipes, setUserRecipes] = useState([]);
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('recipeName_asc');

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

    const sortOptions = [
        {
            key: 'recipeName_asc',
            value: 'recipeName_asc',
            text: 'Recipe Name: Asc',
            func: (a, b) => a.recipeName.localCompare(b.recipeName),
        },
        {
            key: 'recipeName_desc',
            value: 'recipeName_desc',
            text: 'Recipe Name: Desc',
            func: (a, b) => a.recipeName < b.recipeName,
        },
        {
            key: 'activeTimeMinutes_lth',
            value: 'activeTimeMinutes_lth',
            text: 'Active Time: Low to High',
            func: (a, b) => a.activeTimeMinutes > b.activeTimeMinutes,
        },
        {
            key: 'activeTimeMinutes_htl',
            value: 'activeTimeMinutes_htl',
            text: 'Active Time: High to Low',
            func: (a, b) => a.activeTimeMinutes < b.activeTimeMinutes,
        },
        {
            key: 'totalTimeMinutes_lth',
            value: 'totalTimeMinutes_lth',
            text: 'Total Time: Low to High',
            func: (a, b) => a.totalTimeMinutes > b.totalTimeMinutes,
        },
        {
            key: 'totalTimeMinutes_htl',
            value: 'totalTimeMinutes_htl',
            text: 'Totla Time: High to Low',
            func: (a, b) => a.totalTimeMinutes < b.totalTimeMinutes,
        },
    ];

    const sortRecipes = (recipes) => {
        //tags
        const taggedRecipes = recipes.filter((recipe) => firstContainsAllOfSecond(recipe.tags, tags));

        //search
        const searchedRecipes = taggedRecipes.filter(
            (recipe) =>
                recipe.recipeName.includes(search) ||
                recipe.notes.includes(search) ||
                recipe.steps.find((s) => s.contains(search) !== undefined) ||
                recipe.ingredients.find((s) => s.contains(search))
        );

        //sort
        const sortFunc = sortOptions.find((s) => s.key === sort);
        console.log('sortFunc', sortFunc);
        const sortedRecipes = searchedRecipes.sort(sortOptions.sortFunc);
        console.log('sorted', sortedRecipes);
        return sortedRecipes;
    };
    /**
     * TODO
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
     *  Delete a recipe?
     *  Recipe Pagination
     */

    return (
        <div>
            <div>
                <Input icon="search" fluid placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
                <Dropdown
                    placeholder="Sort By"
                    fluid
                    search
                    selection
                    options={sortOptions}
                    onChange={(e, d) => setSort(d.value)}
                />
                <MultiTextInput onChange={setTags} />
            </div>
            <div className="recipe-card-wrapper">
                {sortRecipes(userRecipes).map((recipe) => {
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
