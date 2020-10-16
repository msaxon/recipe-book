import React, { useState, useEffect } from 'react';
import { Dropdown, Input } from 'semantic-ui-react';
import MultiTextInput from '../shared/input/multi-text-input';
import RecipeBookViewModeToggle from './recipe-book-toggle';
import RecipeBookPage from './recipe-book-page';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { getAllUserRecipes } from '../../importer/persistance';
import { firstContainsAllOfSecond } from '../../utils/array-utils';
import './recipe-book-page.scss';
import RecipeBookMinimal from './recipe-book-minimal';
import { setRecipes } from '../../state/actions';

export default function RecipeBookContainer() {
    // const [userRecipes, setUserRecipes] = useState([]);
    const [tags, setTags] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('recipeName_asc');
    const [errorMsg, setErrorMsg] = useState(null);
    const userId = useStore(state => state.googleId);
    const { googleAuth, recipeBookViewMode, recipes: userRecipes } = useStore();

    const dispatch = useDispatch();

    useEffect(() => {
        async function getRecipes() {
            if (userId && googleAuth && userRecipes === null) {
                const recipes = await getAllUserRecipes(userId, googleAuth);
                if (recipes.error) {
                    setErrorMsg(recipes.msg);
                } else {
                    dispatch(setRecipes(recipes));
                }
            }
        }

        getRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [googleAuth, userId]);

    const sortOptions = [
        {
            key: 'recipeName_asc',
            value: 'recipeName_asc',
            text: 'Recipe Name: Asc',
            func: (a, b) => a.recipeName.toLowerCase().localeCompare(b.recipeName.toLowerCase())
        },
        {
            key: 'recipeName_desc',
            value: 'recipeName_desc',
            text: 'Recipe Name: Desc',
            func: (a, b) => b.recipeName.toLowerCase().localeCompare(a.recipeName.toLowerCase())
        },
        {
            key: 'activeTimeMinutes_lth',
            value: 'activeTimeMinutes_lth',
            text: 'Active Time: Low to High',
            func: (a, b) => a.activeTimeMinutes - b.activeTimeMinutes
        },
        {
            key: 'activeTimeMinutes_htl',
            value: 'activeTimeMinutes_htl',
            text: 'Active Time: High to Low',
            func: (a, b) => b.activeTimeMinutes - a.activeTimeMinutes
        },
        {
            key: 'totalTimeMinutes_lth',
            value: 'totalTimeMinutes_lth',
            text: 'Total Time: Low to High',
            func: (a, b) => a.totalTimeMinutes - b.totalTimeMinutes
        },
        {
            key: 'totalTimeMinutes_htl',
            value: 'totalTimeMinutes_htl',
            text: 'Totla Time: High to Low',
            func: (a, b) => b.totalTimeMinutes - a.totalTimeMinutes
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
        console.log('sort func', sortFunc);
        const sortedRecipes = searchedRecipes.sort(sortFunc.func);
        return sortedRecipes;
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
                <RecipeBookPage userRecipes={sortRecipes(userRecipes)} />
            </div>
        );
    }
}
