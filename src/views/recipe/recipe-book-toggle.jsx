import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { setRecipeBookViewMode } from '../../state/actions';
import './recipe-book-page.scss';

export default function RecipeBookViewModeToggle() {
    const { recipeBookViewMode } = useStore();
    const dispatch = useDispatch();
    const onChange = (e, d) => {
        dispatch(setRecipeBookViewMode(d.checked ? 'minimal' : 'default'));
    };

    return (
        <div className="book-view-toggle">
            <Checkbox toggle onChange={onChange} checked={recipeBookViewMode === 'minimal'} />
        </div>
    );
}
