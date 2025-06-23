import { Link } from 'react-router-dom';

import { Card, Container, Text } from '@mantine/core';

import type { Recipe } from '../../models/interfaces';

import './recipe-book-page.scss';

interface IProps {
  recipe: Recipe;
}

export default function RecipeBookCard({ recipe }: IProps) {
  const formatTags = () => {
    if (recipe.tags && recipe.tags.length > 0) {
      return 'Tags: ' + recipe.tags.reduce((a, b) => a + ', ' + b);
    } else {
      return 'Tags: none';
    }
  };

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder={true}
      styles={{
        root: {
          margin: '1em',
          width: 400,
        },
      }}
    >
      <Card.Section>
        <Link to={'/recipes/details?recipeId=' + recipe.recipeId}>
          {recipe.image && (
            <img
              src={recipe.image}
              width="100%"
              height="250px"
              alt=""
              className="recipe-card-img"
              loading="lazy"
            />
          )}
        </Link>
      </Card.Section>

      <Card.Section>
        <Container px={16} pb={8}>
          <Text>{recipe.recipeName}</Text>
          <Text size="xs">{recipe.origin.website}</Text>
          <Text size="sm">{formatTags()}</Text>
        </Container>
      </Card.Section>
    </Card>
  );
}
