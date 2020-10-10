import React from 'react';
import { Checkbox } from 'semantic-ui-react';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { setRecipeViewMode } from '../../state/actions';
import './recipe-detail.scss';

export default function RecipeViewModeToggle() {
    const { recipeViewMode } = useStore();
    const dispatch = useDispatch();
    const onChange = (e, d) => {
        dispatch(setRecipeViewMode(d.checked ? 'index' : 'default'));
    };

    return (
        <div className="recipe-view-toggle">
            <Checkbox toggle onChange={onChange} checked={recipeViewMode === 'index'} />
        </div>
    );
}
