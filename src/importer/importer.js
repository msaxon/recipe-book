import AWS from 'aws-sdk';

const lambdaParams = (url) => {
    return {
        FunctionName: 'arn:aws:lambda:us-east-2:809097150636:function:importRecipe',
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify({ url }),
    };
};

export const importRecipe = async (url) => {
    const lambda = new AWS.Lambda();

    console.log('url', url);
    const response = await lambda.invoke(lambdaParams(url)).promise();

    console.log('done here', JSON.parse(response.Payload));
};
