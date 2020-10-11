import React from 'react';
import { Checkbox, Popup } from 'semantic-ui-react';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { setRecipeViewMode } from '../../state/actions';
import './recipe-detail.scss';

export default function RecipeViewModeToggle() {
    const { recipeViewMode } = useStore();
    const dispatch = useDispatch();
    const onChange = (e, d) => {
        dispatch(setRecipeViewMode(d.checked ? 'index' : 'default'));
    };

    const text = recipeViewMode === 'default' ? 'Swap to index card view' : 'Swap to default view';

    return (
        <div className="recipe-view-toggle">
            <Popup content={text} trigger={<Checkbox toggle onChange={onChange} checked={recipeViewMode === 'index'} />} />
        </div>
    );
}
