import { Link } from 'react-router-dom';

import { Card, Image, Text } from '@mantine/core';

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
      withBorder
      className="recipe-book-card"
    >
      <Card.Section>
        <Link to={'/recipes/details?recipeId=' + recipe.recipeId}>
          {
            <Image
              src={recipe.image ?? 'https://freesvg.org/img/ftkrecipes.png'}
              width="100%"
              height="250px"
              alt=""
              className="recipe-card-img"
              loading="lazy"
            />
          }
        </Link>
      </Card.Section>

      <Card.Section inheritPadding py="xs">
        <Link to={'/recipes/details?recipeId=' + recipe.recipeId}>
          <Text fw={500}>{recipe.recipeName}</Text>
        </Link>
        <Text size="xs" c="dimmed">
          {recipe.origin.website}
        </Text>
        <Text size="sm" mt="xs">
          {formatTags()}
        </Text>
      </Card.Section>
    </Card>
  );
}
