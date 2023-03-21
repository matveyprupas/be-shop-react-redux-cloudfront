import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
const BUCKET = 'be-import-service-s3';

import schema from './schema';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const fileName = event.queryStringParameters.name;
  const paramsUploaded = {
    Bucket: BUCKET,
    Key: `uploaded/${fileName}`,
  }; 
  const s3Client = new S3Client({region: 'eu-west-1'});
  const putCommand = new PutObjectCommand(paramsUploaded);
  const signedURL = await getSignedUrl(s3Client, putCommand, {expiresIn: 3600});

  return formatJSONResponse({
    url: signedURL
  });
};

export const main = middyfy(importProductsFile).use(cors());
