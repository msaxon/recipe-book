import { Table } from '@mantine/core';
import { Link } from 'react-router-dom';

import type { Recipe } from '../../models/interfaces';
import { minutesToTime } from '../../utils/time-utils';

interface IProps {
  recipes: Recipe[];
}

export default function RecipeBookMinimal({ recipes }: IProps) {
  return (
    <div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Recipe</Table.Th>
            <Table.Th>Active Time</Table.Th>
            <Table.Th>Total Time</Table.Th>
            <Table.Th>Notes</Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {recipes.map((r) => {
            return (
              <Table.Tr key={r.recipeId}>
                <Table.Td>
                  <Link to={'/recipes/details?recipeId=' + r.recipeId}>
                    {r.recipeName}
                  </Link>
                </Table.Td>
                <Table.Td>{minutesToTime(r.activeTimeMinutes)}</Table.Td>
                <Table.Td>{minutesToTime(r.totalTimeMinutes)}</Table.Td>
                <Table.Td>{r.notes}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
}
