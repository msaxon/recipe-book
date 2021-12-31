import React from 'react';
import { convertMarkdownToHtml } from '../../utils/markdown-utils';

import './recipe-detail.scss';
import RecipeViewModeToggle from './recipe-view-mode-toggle';
import {Recipe} from "../../models/interfaces";

interface IProps {
    recipe: Recipe
}

export default function RecipeDetailIndexCard({ recipe }: IProps) {
    return (
        <div className="index-card">
            <RecipeViewModeToggle />
            <h2>{recipe.recipeName}</h2>
            <div className="red-line" />
            <div className="general-text">
                <div className="steps">
                    {recipe.steps.split('\n').map(step => (
                        <p>{step}</p>
                    ))}
                </div>
                <div className="items">
                    <div dangerouslySetInnerHTML={{ __html: convertMarkdownToHtml(recipe.ingredients) }} />
                </div>
            </div>
            <div className="general-text">
                <div>
                    <p>Notes: {recipe.notes}</p>
                </div>
            </div>
        </div>
    );
}
