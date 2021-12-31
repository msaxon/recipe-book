import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { minutesToTime } from '../../utils/time-utils';
import {Recipe} from "../../models/interfaces";

interface IProps {
    recipes: Recipe[]
}

export default function RecipeBookMinimal({ recipes }: IProps) {
    return (
        <div>
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Recipe</Table.HeaderCell>
                        <Table.HeaderCell>Active Time</Table.HeaderCell>
                        <Table.HeaderCell>Total Time</Table.HeaderCell>
                        <Table.HeaderCell>Notes</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {recipes.map(r => {
                        return (
                            <Table.Row>
                                <Table.Cell>
                                    <Link to={'/recipes/details?recipeId=' + r.recipeId}>{r.recipeName}</Link>
                                </Table.Cell>
                                <Table.Cell>{minutesToTime(r.activeTimeMinutes)}</Table.Cell>
                                <Table.Cell>{minutesToTime(r.totalTimeMinutes)}</Table.Cell>
                                <Table.Cell>{r.notes}</Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table>
        </div>
    );
}
