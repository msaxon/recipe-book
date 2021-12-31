import {DBAttributeMap} from './dynamo-types';
import {DynamoDB} from 'aws-sdk';
import {Recipe, User, UserRecipe} from "../models/interfaces";

export const recipeToDbParams = (recipe: Recipe): DBAttributeMap => {
    return DynamoDB.Converter.marshall(recipe);
}

export const dbResponseToRecipeIds = (response: DBAttributeMap | undefined): string[] => {
    if(!response) return [];

    // @ts-ignore coming back as a Set instead of an array
    return (DynamoDB.Converter.unmarshall(response) as UserRecipe).recipeId.values;
}

export const dbResponseToRecipeList = (response: DBAttributeMap[] | undefined): Recipe[] => {
    if(!response) return [];
    return response.map(r => DynamoDB.Converter.unmarshall(r) as Recipe);
}

export const dbResponseToRecipe = (response: DBAttributeMap | undefined): Recipe => {
    if(!response) return {} as Recipe;
    return DynamoDB.Converter.unmarshall(response) as Recipe;
}

export const dbResponseToUsers = (response: DBAttributeMap[]  | undefined): User[] => {
    if(!response) return [];
    return response.map(r => DynamoDB.Converter.unmarshall(r) as User);
}