import React, { useContext } from 'react';
import { Checkbox, Popup } from 'semantic-ui-react';
import './recipe-book-page.scss';
import { CheckboxProps } from 'semantic-ui-react/dist/commonjs/modules/Checkbox/Checkbox';
import { RecipeContext } from '../../App';

export default function RecipeBookViewModeToggle() {
  const { recipeBookViewMode, setRecipeBookViewMode } =
    useContext(RecipeContext);
  const x = useContext(RecipeContext);
  console.log('x', x);

  const onChange = (
    event: React.FormEvent<HTMLInputElement>,
    d: CheckboxProps
  ) => {
    console.log('toggling', d.checked ? 'minimal' : 'default');
    setRecipeBookViewMode(d.checked ? 'minimal' : 'default');
  };

  const text =
    recipeBookViewMode === 'default'
      ? 'Swap to minimal view'
      : 'Swap to default view';

  return (
    <div className="book-view-toggle">
      <Popup
        content={text}
        trigger={
          <Checkbox
            toggle
            onChange={onChange}
            checked={recipeBookViewMode === 'minimal'}
          />
        }
      />
    </div>
  );
}
