import AWS from 'aws-sdk';
import {
    v4 as uuidv4
} from 'uuid';

/* Helper Functions */
const setupAuth = async accessToken => {
    AWS.config.update({
        region: 'us-east-2'
    });
    let credentials = new AWS.WebIdentityCredentials({
        RoleArn: 'arn:aws:iam::809097150636:role/recipeBook-user'
    });
    credentials.params.WebIdentityToken = accessToken;

    credentials.refresh(function (err) {
        if (err) {
            console.log('Error logging into application');
        } else {
            console.log('Logged into application as administrator');
        }
    });

    return new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        credentials: credentials
    });
};

/* Service Calls */
const getRecipeIdsByUser = async (userId, accessToken) => {
    const db = await setupAuth(accessToken);
    const getRecipeIdParams = {
        ExpressionAttributeValues: {
            ':id': {
                S: userId
            }
        },
        KeyConditionExpression: 'userId = :id',
        ProjectionExpression: 'userId, recipeId',
        TableName: 'recipeBook-userRecipePair'
    };

    try {
        const recipeIdResponse = await db.query(getRecipeIdParams).promise();
        return recipeIdResponse;
    } catch (e) {
        console.error('error occured getting user', e);
        return {
            error: true
        };
    }
};

const getRecipesByIdList = async (idList, accessToken) => {
    const db = await setupAuth(accessToken);
    const getRecipesParams = {
        RequestItems: {
            'recipeBook-recipe': {
                Keys: idList.map(r => {
                    return {
                        recipeId: {
                            S: r
                        }
                    };
                })
            }
        }
    };

    try {
        const recipeResponse = await db.batchGetItem(getRecipesParams).promise();
        return recipeResponse;
    } catch (error) {
        console.log('an error occured getting the batch items');
        return {
            error: true,
            msg: 'Had trouble getting your recipes, please try again later.'
        };
    }
};

const getRecipeById = async (recipeId, accessToken) => {
    const db = await setupAuth(accessToken);
    const getRecipeIdParams = {
        Key: {
            recipeId: {
                S: recipeId
            }
        },
        TableName: 'recipeBook-recipe'
    };

    const recipeResponse = await db.getItem(getRecipeIdParams).promise();
    return recipeResponse;
};

// const getRecentRecipes = async (accessToken) => {
//     const db = await setupAuth(accessToken);
//     //TODO
// }

const postRecipe = async (recipe, accessToken) => {
    const db = await setupAuth(accessToken);
    const putRecipeParams = {
        TableName: 'recipeBook-recipe',
        Item: recipe.toDatabaseParams()
    };

    try {
        const postRecipeResponse = await db.putItem(putRecipeParams).promise();
        return postRecipeResponse;
    } catch (e) {
        console.error('error occured saving recipe', e);
        return {
            error: true
        };
    }
};

const postRecipeUserRelationship = async (recipeIds, userId, accessToken) => {
    const db = await setupAuth(accessToken);
    const putUserParams = {
        TableName: 'recipeBook-userRecipePair',
        Item: {
            userId: {
                S: userId
            },
            recipeId: {
                SS: recipeIds
            }
        }
    };

    try {
        const userResponse = await db.putItem(putUserParams).promise();
        return userResponse;
    } catch (e) {
        console.error('error occured saving relationship', e);
        return {
            error: true
        };
    }
};

const deleteRecipeActual = async (recipeId, accessToken) => {
    const db = await setupAuth(accessToken);
    const deleteRecipeParams = {
        TableName: 'recipeBook-recipe',
        Key: {
            recipeId: {
                S: recipeId
            }
        }
    };

    try {
        const response = await db.deleteItem(deleteRecipeParams).promise();
        return response;
    } catch (err) {
        console.log('error during delete', err);
        return {
            error: true
        };
    }
};

const getUsers = async (accessToken) => {
    const db = await setupAuth(accessToken);
    const params = {
        TableName: 'recipeBook-user',
        Select: "ALL_ATTRIBUTES"
    };

    try {
        const response = await db.scan(params).promise();
        return response;
    } catch (e) {
        console.log('error occured getting user', e);
        return {
            error: true
        };
    }
}

/* Exposed user functions */

export const getAllUserRecipes = async (userId, accessToken) => {
    console.log('userId', userId);
    const recipeIdResponse = await getRecipeIdsByUser(userId, accessToken);
    if (recipeIdResponse.error) {
        return recipeIdResponse;
    } else if (recipeIdResponse.Items.length === 0) {
        //no need to call if there are no recipes
        return {
            error: true,
            msg: 'You have no recipes yet'
        };
    }
    try {
        const recipeListResponse = await getRecipesByIdList(recipeIdResponse.Items[0].recipeId.SS, accessToken);
        const recipeList = recipeListResponse.Responses['recipeBook-recipe'];
        return recipeList.map(r => AWS.DynamoDB.Converter.unmarshall(r));
    } catch (error) {
        console.log('there was an error getting your recipes');
        return {
            error: true,
            msg: 'There was an error fetching your recipes, please try again later'
        };
    }
};

export const getSingleRecipe = async (recipeId, accessToken) => {
    const recipeResponse = await getRecipeById(recipeId, accessToken);
    return AWS.DynamoDB.Converter.unmarshall(recipeResponse.Item);
};

export const putNewRecipe = async (recipe, userId, accessToken) => {
    recipe.recipeId = uuidv4();

    //post the recipe
    let error = await postRecipe(recipe, accessToken);
    if (error.error) {
        return error;
    }

    //get the user
    const response = await getRecipeIdsByUser(userId, accessToken);
    if (response.error) {
        return response;
    }

    const ids = response.Items.length > 0 ? response.Items[0].recipeId.SS : response.Items;
    ids.push(recipe.recipeId);

    //post the user
    error = await postRecipeUserRelationship(ids, userId, accessToken);
    if (error.error) {
        return error;
    }
    return {
        error: false,
        recipeId: recipe.recipeId
    };
};

export const updateOldRecipe = async (recipe, userId, accessToken) => {
    const storedRecipe = await getSingleRecipe(recipe.recipeId, accessToken);
    if (storedRecipe.origin.ownerId === userId) {
        let error = await postRecipe(recipe, accessToken);
        if (error.error) {
            return error;
        } else {
            return {
                error: false,
                recipeId: recipe.recipeId
            };
        }
    } else {
        return {
            error: true,
            msg: "You don't have own this recipe."
        };
    }
};

export const deleteRecipeRelationship = async (recipe, userId, accessToken) => {
    //get recipeIds
    const response = await getRecipeIdsByUser(userId, accessToken);
    if (response.error) {
        return response;
    }

    let ids = response.Items.length > 0 ? response.Items[0].recipeId.SS : response.Items;
    ids = ids.filter(id => id !== recipe.recipeId);

    //update recipeIds
    const error = await postRecipeUserRelationship(ids, userId, accessToken);
    if (error.error) {
        return error;
    }
    return {
        error: false,
        recipeId: recipe.recipeId
    };
};

export const deleteRecipe = async (recipe, userId, accessToken) => {
    const response = deleteRecipeRelationship(recipe, userId, accessToken);
    if (response.error) {
        return response;
    } else {
        //delete actual recipe
        return await deleteRecipeActual(recipe.recipeId, accessToken);
    }
};

export const getAllUserRecipeIds = async (userId, accessToken) => {
    const recipeIdResponse = await getRecipeIdsByUser(userId, accessToken);
    if (recipeIdResponse.error) {
        return recipeIdResponse;
    } else {
        console.log('recipeIdResponse', recipeIdResponse);
        return recipeIdResponse.Items.length > 0 ? recipeIdResponse.Items[0].recipeId.SS : [];
    }
};

export const putNewRecipeRelationship = async (userId, recipeId, accessToken) => {
    //get the user
    const response = await getRecipeIdsByUser(userId, accessToken);
    if (response.error) {
        return response;
    }

    const ids = response.Items.length > 0 ? response.Items[0].recipeId.SS : response.Items;
    ids.push(recipeId);

    //post the user
    const error = await postRecipeUserRelationship(ids, userId, accessToken);
    if (error.error) {
        return error;
    }
    return {
        error: false,
        recipeId: recipeId
    };
};

export const getAllUsers = async (accessToken) => {
    const response = await getUsers(accessToken);
    if(response.error) {
        return response;
    } else {
        return response.Items.length > 0 ? response.Items : [];
    }
}

/**
 *  i created this recipe | i imported this recipe
 *      1) create the db recipe
 *      2) connect it to the user
 */

/**
 *  i am editing this recipe
 *      1) check if im the owner
 *      2) update the recipe record
 */

/**
 * I'm copying a friends recipe
 *     1) connect it to the user
 */