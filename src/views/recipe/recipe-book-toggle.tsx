import { Switch } from '@mantine/core';

import { useRecipeContext } from '../../context/recipe-context.tsx';

import './recipe-book-page.scss';

export default function RecipeBookViewModeToggle() {
  const { recipeBookViewMode, setRecipeBookViewMode } = useRecipeContext();

  const text =
    recipeBookViewMode === 'default'
      ? 'Swap to minimal view'
      : 'Swap to default view';

  return (
    <div className="book-view-toggle">
      <Switch
        checked={recipeBookViewMode === 'minimal'}
        onChange={(event) => {
          console.log(event.currentTarget.checked);
          setRecipeBookViewMode(
            event.currentTarget.checked ? 'minimal' : 'default'
          );
        }}
        label={text}
      />
    </div>
  );
}
