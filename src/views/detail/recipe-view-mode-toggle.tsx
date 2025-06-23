import { Switch } from '@mantine/core';

import { useRecipeContext } from '../../context/recipe-context.tsx';

import './recipe-detail.scss';

export default function RecipeViewModeToggle() {
  const { recipeViewMode, setRecipeViewMode } = useRecipeContext();

  const text =
    recipeViewMode === 'default'
      ? 'Swap to index card view'
      : 'Swap to default view';

  return (
    <div className="recipe-view-toggle">
      <Switch
        onChange={(e) => {
          setRecipeViewMode(e.currentTarget.checked ? 'index' : 'default');
        }}
        checked={recipeViewMode === 'index'}
        label={text}
      />
    </div>
  );
}
