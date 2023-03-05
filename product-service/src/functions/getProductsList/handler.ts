import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'

import schema from './schema';
const awsConfig = require('../../../config.json');
const AWS = require('aws-sdk');

AWS.config.update(awsConfig);

const ddb = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "serverless_products";

const onScan = async (err, data) => {
  if (err) {
    console.error('Unable to scan the table. Error: ', JSON.stringify(err));
    return;
  }

  console.log('Scan succeeded! Data: ', JSON.stringify(data));

  if (typeof data.LastEvaluatedKey !== 'undefined') {
    console.log('Scanning for more...');
    const params = {
      TableName: TABLE_NAME,
      ExclusiveStartKey: data.LastEvaluatedKey,
    };
    ddb.scan(params, onScan);
  }
};

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const params = { TableName: TABLE_NAME };
  const body = await ddb.scan(params, onScan).promise();

  console.log('body: ', body);

  return formatJSONResponse(body.Items);
};

export const main = middyfy(getProductsList).use(cors());
