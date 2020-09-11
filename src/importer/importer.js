import AWS from 'aws-sdk';

const setupAuth = async (accessToken) => {
    AWS.config.update({
        region: 'us-east-2',
    });
    let credentials = new AWS.WebIdentityCredentials({
        RoleArn: 'arn:aws:iam::809097150636:role/recipeBook-user',
    });
    credentials.params.WebIdentityToken = accessToken;

    credentials.refresh(function (err) {
        if (err) {
            console.log('Error logging into application');
        } else {
            console.log('Logged into application as administrator');
        }
    });

    return new AWS.Lambda({ credentials: credentials });
};

const lambdaParams = (url) => {
    return {
        FunctionName: 'arn:aws:lambda:us-east-2:809097150636:function:importRecipe',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ url }),
    };
};

export const importRecipe = async (url, googleAuth) => {
    const lambda = await setupAuth(googleAuth);
    const response = await lambda.invoke(lambdaParams(url)).promise();
    console.log('response.payload', JSON.parse(response.Payload));
    return JSON.parse(response.Payload).body.recipe;
};
