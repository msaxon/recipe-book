import React, { useContext } from 'react';
import { Checkbox, Popup } from 'semantic-ui-react';
import './recipe-detail.scss';
import { CheckboxProps } from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import { RecipeContext } from '../../App';

export default function RecipeViewModeToggle() {
  const { recipeViewMode, setRecipeViewMode } = useContext(RecipeContext);

  const onChange = (
    event: React.FormEvent<HTMLInputElement>,
    d: CheckboxProps
  ) => {
    setRecipeViewMode(d.checked ? 'index' : 'default');
  };

  const text =
    recipeViewMode === 'default'
      ? 'Swap to index card view'
      : 'Swap to default view';

  return (
    <div className="recipe-view-toggle">
      <Popup
        content={text}
        trigger={
          <Checkbox
            toggle
            onChange={onChange}
            checked={recipeViewMode === 'index'}
          />
        }
      />
    </div>
  );
}
