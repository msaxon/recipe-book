import React from 'react';
import { Checkbox, Popup } from 'semantic-ui-react';
import { useStore, useDispatch } from '../../utils/hooks/useStore';
import { setRecipeBookViewMode } from '../../state/actions';
import './recipe-book-page.scss';

export default function RecipeBookViewModeToggle() {
    const { recipeBookViewMode } = useStore();
    const dispatch = useDispatch();
    const onChange = (e, d) => {
        dispatch(setRecipeBookViewMode(d.checked ? 'minimal' : 'default'));
    };

    const text = recipeBookViewMode === 'default' ? 'Swap to minimal view' : 'Swap to default view';

    return (
        <div className="book-view-toggle">
            <Popup content={text} trigger={<Checkbox toggle onChange={onChange} checked={recipeBookViewMode === 'minimal'} />} />
        </div>
    );
}
