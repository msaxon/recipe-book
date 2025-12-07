import { usePageTitle } from '../../hooks/usePageTitle.ts';
import type { Recipe } from '../../models/interfaces';
import { convertMarkdownToHtml } from '../../utils/markdown-utils';
import RecipeViewModeToggle from './recipe-view-mode-toggle';

import './recipe-detail.scss';

interface IProps {
  recipe: Recipe;
}

export default function RecipeDetailIndexCard({ recipe }: IProps) {
  usePageTitle(recipe.recipeName);
  return (
    <div>
      <RecipeViewModeToggle />
      <div className="index-card">
        <h2>{recipe.recipeName}</h2>
        <div className="red-line" />
        <div className="general-text">
          <div className="steps">
            {recipe.steps.split('\n').map((step) => (
              <p>{step}</p>
            ))}
          </div>
          <div className="items">
            <div
              dangerouslySetInnerHTML={{
                __html: convertMarkdownToHtml(recipe.ingredients),
              }}
            />
          </div>
        </div>
        <div className="general-text">
          <div>
            <p>Notes: {recipe.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
