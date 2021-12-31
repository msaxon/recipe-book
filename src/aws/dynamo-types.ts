import {PromiseResult} from 'aws-sdk/lib/request';
import {AWSError, DynamoDB} from 'aws-sdk';

export type DBQuery = PromiseResult<DynamoDB.QueryOutput, AWSError>;
export type DBBatchItem = PromiseResult<DynamoDB.Types.BatchGetItemOutput, AWSError>
export type DBGetItem = PromiseResult<DynamoDB.Types.GetItemOutput, AWSError>;
export type DBPutItem = PromiseResult<DynamoDB.Types.PutItemOutput, AWSError>;
export type DBDeleteItem = PromiseResult<DynamoDB.Types.DeleteItemOutput, AWSError>;
export type DBScan = PromiseResult<DynamoDB.Types.ScanOutput, AWSError>;

export type DBAttributeMap = DynamoDB.AttributeMap;