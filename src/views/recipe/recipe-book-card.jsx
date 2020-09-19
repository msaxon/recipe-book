import React from 'react';
import { Card } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { isUrl } from '../../utils/string-utils';
import './recipe-book-page.scss';

export default function RecipeBookCard({ recipe }) {
    const formatTags = () => {
        if (recipe.tags && recipe.tags.length > 0) {
            return 'Tags: ' + recipe.tags.reduce((a, b) => a + ', ' + b);
        } else {
            return 'Tags: none';
        }
    };

    const formatWebsiteLink = () => {
        if (isUrl(recipe.origin.url)) {
            return <a href={'https://' + new URL(recipe.origin.url).hostname}>{recipe.origin.website}</a>;
        } else {
            return <p>{recipe.origin.website}</p>;
        }
    };

    return (
        <Card>
            <img src={recipe.image} width="100%" height="300" alt="" className="recipe-card-img" />
            <Card.Content>
                <Card.Header>
                    <Link to={'/recipes/details?recipeId=' + recipe.recipeId}>{recipe.recipeName}</Link>
                </Card.Header>
                <Card.Meta>{formatWebsiteLink()}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <p>{formatTags()}</p>
            </Card.Content>
        </Card>
    );
}
