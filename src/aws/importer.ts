import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';
import { fromWebToken } from '@aws-sdk/credential-providers';

const setupAuth = async (accessToken: string): Promise<LambdaClient> => {
  const credentials = fromWebToken({
    roleArn: 'arn:aws:iam::809097150636:role/recipeBook-user',
    roleSessionName: 'web',
    webIdentityToken: accessToken,
  });

  await credentials();

  return new LambdaClient({
    region: 'us-east-2',
    credentials,
  });
};

const lambdaParams = (url: string) => ({
  FunctionName: 'arn:aws:lambda:us-east-2:809097150636:function:importRecipe',
  InvocationType: 'RequestResponse' as const,
  Payload: new TextEncoder().encode(JSON.stringify({ url })),
});

export const importRecipe = async (url: string, googleAuth: string) => {
  const lambda = await setupAuth(googleAuth);
  try {
    const response = await lambda.send(new InvokeCommand(lambdaParams(url)));
    if (!response.Payload) {
      throw new Error('No payload returned from Lambda');
    }
    const payloadString = new TextDecoder().decode(response.Payload);
    const parsed = JSON.parse(payloadString);
    return parsed.body?.recipe;
  } catch (error) {
    return { error: true, msg: error };
  }
};
