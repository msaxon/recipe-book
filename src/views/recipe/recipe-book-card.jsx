import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { isUrl } from '../../utils/string-utils';

export default function RecipeBookCard({ recipe }) {
    const formatTags = () => {
        if (recipe.tags && recipe.tags.length > 0) {
            console.log('recipe.tags', recipe.tags);
            return 'Tags: ' + recipe.tags.reduce((a, b) => a + ', ' + b);
        } else {
            return 'Tags: none';
        }
    };

    const formatWebsiteLink = () => {
        if (isUrl(recipe.origin.url)) {
            return <a href={'https://' + new URL(recipe.origin.url).hostname}>{recipe.origin.website}</a>;
        } else {
            console.log(recipe.origin.url + ' is not a valid URL');
            return <p>{recipe.origin.website}</p>;
        }
    };

    return (
        <Card>
            <Image src={recipe.image} wrapped ui={false} />
            <Card.Content>
                <Card.Header>
                    <Link to={'/recipes/details?recipeId=' + recipe.recipeId}>{recipe.recipeName}</Link>
                </Card.Header>
                <Card.Meta>{formatWebsiteLink()}</Card.Meta>
                <Card.Description>{recipe.notes}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <p>{formatTags()}</p>
            </Card.Content>
        </Card>
    );
}
