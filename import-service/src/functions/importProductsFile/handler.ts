import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
const BUCKET = 'be-import-service-s3';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const fileName = event.queryStringParameters.name;

  return formatJSONResponse({
    url: `https://${BUCKET}.s3.eu-west-1.amazonaws.com/uploaded/${fileName}`
  });
};

export const main = middyfy(importProductsFile).use(cors());
