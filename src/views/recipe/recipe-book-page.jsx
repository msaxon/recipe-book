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
    const [errorMsg, setErrorMsg] = useState(null);

    const userId = useStore(state => state.googleId);
    const googleAuth = useStore(state => state.googleAuth);

    useEffect(() => {
        async function getRecipes() {
            if (userId && googleAuth) {
                const recipes = await getAllUserRecipes(userId, googleAuth);
                if (recipes.error) {
                    setErrorMsg(recipes.msg);
                } else {
                    setUserRecipes(recipes);
                }
            }
        }

        getRecipes();
    }, [googleAuth, userId]);

    const sortOptions = [
        {
            key: 'recipeName_asc',
            value: 'recipeName_asc',
            text: 'Recipe Name: Asc',
            func: (a, b) => a.recipeName.toLowerCase() > b.recipeName.toLowerCase()
        },
        {
            key: 'recipeName_desc',
            value: 'recipeName_desc',
            text: 'Recipe Name: Desc',
            func: (a, b) => a.recipeName.toLowerCase() < b.recipeName.toLowerCase()
        },
        {
            key: 'activeTimeMinutes_lth',
            value: 'activeTimeMinutes_lth',
            text: 'Active Time: Low to High',
            func: (a, b) => a.activeTimeMinutes > b.activeTimeMinutes
        },
        {
            key: 'activeTimeMinutes_htl',
            value: 'activeTimeMinutes_htl',
            text: 'Active Time: High to Low',
            func: (a, b) => a.activeTimeMinutes < b.activeTimeMinutes
        },
        {
            key: 'totalTimeMinutes_lth',
            value: 'totalTimeMinutes_lth',
            text: 'Total Time: Low to High',
            func: (a, b) => a.totalTimeMinutes > b.totalTimeMinutes
        },
        {
            key: 'totalTimeMinutes_htl',
            value: 'totalTimeMinutes_htl',
            text: 'Totla Time: High to Low',
            func: (a, b) => a.totalTimeMinutes < b.totalTimeMinutes
        }
    ];

    const sortRecipes = recipes => {
        //tags
        const taggedRecipes = recipes.filter(recipe => firstContainsAllOfSecond(recipe.tags, tags));

        //search
        const searchedRecipes = taggedRecipes.filter(recipe => {
            return (
                (recipe.recipeName && recipe.recipeName.includes(search)) ||
                (recipe.notes && recipe.notes.includes(search)) ||
                (recipe.steps && recipe.steps.includes(search)) ||
                (recipe.ingredients && recipe.ingredients.includes(search))
            );
        });

        //sort
        const sortFunc = sortOptions.find(s => s.key === sort);
        const sortedRecipes = searchedRecipes.sort(sortFunc.func);
        return sortedRecipes;
    };
    /**
     * TODO

     *  Delete a recipe?
     *  Recipe Pagination
     */

    return (
        <div>
            <div className="row filter-section">
                <div className="col-12 col-lg-4">
                    <Input icon="search" fluid placeholder="Search..." onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="col-12 col-lg-4">
                    <Dropdown
                        placeholder="Sort By"
                        fluid
                        search
                        selection
                        options={sortOptions}
                        onChange={(e, d) => setSort(d.value)}
                    />
                </div>
                <div className="col-12 col-lg-4">
                    <MultiTextInput onChange={setTags} />
                </div>
            </div>
            <div>
                <p>{errorMsg}</p>
            </div>
            <div className="recipe-card-wrapper">
                {sortRecipes(userRecipes).map(recipe => {
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
