import {config, WebIdentityCredentials, Lambda} from 'aws-sdk';

const setupAuth = async (accessToken: string) => {
    config.update({
        region: 'us-east-2'
    });
    const credentials = new WebIdentityCredentials({
        RoleSessionName: 'web',
        WebIdentityToken: accessToken,
        RoleArn: 'arn:aws:iam::809097150636:role/recipeBook-user'
    });

    credentials.refresh(function (err) {
        if (err) {
            console.log('Error logging into application');
        } else {
            console.log('Logged into application as administrator');
        }
    });

    return new Lambda({
        credentials: credentials
    });
};
const lambdaParams = (url: string) => {
    return {
        FunctionName: 'arn:aws:lambda:us-east-2:809097150636:function:importRecipe',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({
            url
        })
    };
};
export const importRecipe = async (url: string, googleAuth: string) => {
    const lambda = await setupAuth(googleAuth);
    try {
        const response = await lambda.invoke(lambdaParams(url)).promise();
        return JSON.parse(response.Payload?.toLocaleString() || '').body.recipe;
    } catch (error) {
        return {error: true, msg: error};
    }
}