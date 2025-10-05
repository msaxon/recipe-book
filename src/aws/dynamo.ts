import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromWebToken } from '@aws-sdk/credential-providers';
import {
  BatchGetCommand,
  type BatchGetCommandOutput,
  DeleteCommand,
  type DeleteCommandOutput,
  GetCommand,
  type GetCommandOutput,
  PutCommand,
  type PutCommandOutput,
  QueryCommand,
  type QueryCommandOutput,
  ScanCommand,
  type ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';

import type { Recipe } from '../models/interfaces';

/*** Setup ***/

let db: DynamoDBClient | null = null;

export const setupAuth = async (
  accessToken: string
): Promise<DynamoDBClient> => {
  if (db) {
    console.log('client already initialized');
    return db;
  }

  const credentials = fromWebToken({
    roleArn: 'arn:aws:iam::809097150636:role/recipeBook-user',
    roleSessionName: 'web',
    webIdentityToken: accessToken,
  });

  try {
    await credentials();
    console.log('Logged into application as administrator');
  } catch (err) {
    console.error('Error logging into application', err);
  }

  db = new DynamoDBClient({
    region: 'us-east-2',
    credentials,
  });

  return db;
};

/*** CRUD ***/
export const getRecipeIdsByUser = async (
  userId: string,
  accessToken: string
): Promise<QueryCommandOutput> => {
  const db = await setupAuth(accessToken);
  const getRecipeIdParams = {
    TableName: 'recipeBook-userRecipePair',
    KeyConditionExpression: 'userId = :id',
    ExpressionAttributeValues: {
      ':id': userId,
    },
    ProjectionExpression: 'userId, recipeId',
  };

  try {
    console.log('trying the query');
    return await db.send(new QueryCommand(getRecipeIdParams));
  } catch (error) {
    console.error('Error querying recipe IDs:', error);
    throw error;
  }
};

export const getRecipesByIdList = async (
  idList: string[],
  accessToken: string
): Promise<BatchGetCommandOutput> => {
  const db = await setupAuth(accessToken);

  const getRecipesParams = {
    RequestItems: {
      'recipeBook-recipe': {
        Keys: idList.map((r) => ({
          recipeId: r,
        })),
      },
    },
  };

  try {
    return await db.send(new BatchGetCommand(getRecipesParams));
  } catch (error) {
    console.error('Error fetching recipes by ID list:', error);
    throw error;
  }
};

export const getRecipeById = async (
  recipeId: string,
  accessToken: string
): Promise<GetCommandOutput> => {
  const db = await setupAuth(accessToken);
  const getRecipeIdParams = {
    TableName: 'recipeBook-recipe',
    Key: {
      recipeId: recipeId,
    },
  };

  return db.send(new GetCommand(getRecipeIdParams));
};

export const postRecipe = async (
  recipe: Recipe,
  accessToken: string
): Promise<PutCommandOutput> => {
  const db = await setupAuth(accessToken);
  const putRecipeParams = {
    TableName: 'recipeBook-recipe',
    Item: recipe,
  };

  return db.send(new PutCommand(putRecipeParams));
};

export const postRecipeUserRelationship = async (
  recipeIds: string[],
  userId: string,
  accessToken: string
): Promise<PutCommandOutput> => {
  const db = await setupAuth(accessToken);
  const putUserParams = {
    TableName: 'recipeBook-userRecipePair',
    Item: {
      userId: userId,
      recipeId: recipeIds,
    },
  };

  return db.send(new PutCommand(putUserParams));
};

export const deleteRecipeActual = async (
  recipeId: string,
  accessToken: string
): Promise<DeleteCommandOutput> => {
  const db = await setupAuth(accessToken);
  const deleteRecipeParams = {
    TableName: 'recipeBook-recipe',
    Key: {
      recipeId: recipeId,
    },
  };

  return db.send(new DeleteCommand(deleteRecipeParams));
};

export const getUsers = async (
  accessToken: string
): Promise<ScanCommandOutput> => {
  const db = await setupAuth(accessToken);
  const params = {
    TableName: 'recipeBook-user',
    Select: 'ALL_ATTRIBUTES' as const,
  };

  return db.send(new ScanCommand(params));
};
