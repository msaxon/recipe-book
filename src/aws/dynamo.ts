import { config, DynamoDB, WebIdentityCredentials } from 'aws-sdk';
import {
  DBBatchItem,
  DBDeleteItem,
  DBGetItem,
  DBPutItem,
  DBQuery,
  DBScan,
} from './dynamo-types';
import { Recipe } from '../models/interfaces';
import { recipeToDbParams } from './dynamo-utils';

/*** Setup ***/

let db: DynamoDB;

export const setupAuth = async (accessToken: string): Promise<void> => {
  if (db) {
    return;
  }

  config.update({
    region: 'us-east-2',
  });
  const credentials = new WebIdentityCredentials({
    RoleArn: 'arn:aws:iam::809097150636:role/recipeBook-user',
    RoleSessionName: 'web',
    WebIdentityToken: accessToken,
  });

  credentials.refresh(function (err) {
    if (err) {
      console.log('Error logging into application');
    } else {
      console.log('Logged into application as administrator');
    }
  });

  db = new DynamoDB({
    apiVersion: '2012-08-10',
    credentials: credentials,
  });
};

/*** CRUD ***/
export const getRecipeIdsByUser = async (
  userId: string,
  accessToken: string
): Promise<DBQuery> => {
  await setupAuth(accessToken);
  const getRecipeIdParams = {
    ExpressionAttributeValues: {
      ':id': {
        S: userId,
      },
    },
    KeyConditionExpression: 'userId = :id',
    ProjectionExpression: 'userId, recipeId',
    TableName: 'recipeBook-userRecipePair',
  };

  return db.query(getRecipeIdParams).promise();
};

export const getRecipesByIdList = async (
  idList: string[],
  accessToken: string
): Promise<DBBatchItem> => {
  await setupAuth(accessToken);
  const getRecipesParams = {
    RequestItems: {
      'recipeBook-recipe': {
        Keys: idList.map((r) => {
          return {
            recipeId: {
              S: r,
            },
          };
        }),
      },
    },
  };

  return db.batchGetItem(getRecipesParams).promise();
};

export const getRecipeById = async (
  recipeId: string,
  accessToken: string
): Promise<DBGetItem> => {
  await setupAuth(accessToken);
  const getRecipeIdParams = {
    Key: {
      recipeId: {
        S: recipeId,
      },
    },
    TableName: 'recipeBook-recipe',
  };

  return db.getItem(getRecipeIdParams).promise();
};

export const postRecipe = async (
  recipe: Recipe,
  accessToken: string
): Promise<DBPutItem> => {
  await setupAuth(accessToken);
  const putRecipeParams = {
    TableName: 'recipeBook-recipe',
    Item: recipeToDbParams(recipe),
  };

  return db.putItem(putRecipeParams).promise();
};

export const postRecipeUserRelationship = async (
  recipeIds: string[],
  userId: string,
  accessToken: string
): Promise<DBPutItem> => {
  await setupAuth(accessToken);
  const putUserParams = {
    TableName: 'recipeBook-userRecipePair',
    Item: {
      userId: {
        S: userId,
      },
      recipeId: {
        SS: recipeIds,
      },
    },
  };

  return db.putItem(putUserParams).promise();
};

export const deleteRecipeActual = async (
  recipeId: string,
  accessToken: string
): Promise<DBDeleteItem> => {
  await setupAuth(accessToken);
  const deleteRecipeParams = {
    TableName: 'recipeBook-recipe',
    Key: {
      recipeId: {
        S: recipeId,
      },
    },
  };

  return db.deleteItem(deleteRecipeParams).promise();
};

export const getUsers = async (accessToken: string): Promise<DBScan> => {
  await setupAuth(accessToken);
  const params = {
    TableName: 'recipeBook-user',
    Select: 'ALL_ATTRIBUTES',
  };

  return db.scan(params).promise();
};
