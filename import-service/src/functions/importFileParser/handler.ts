import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
import { createReadStream } from 'fs';
const AWS = require('aws-sdk');
const { S3Client } = require('@aws-sdk/client-s3');

const csv = require('csv-parser')
const BUCKET = 'be-import-service-s3';

// const s3 = new AWS.S3({
//   region: 'eu-west-1', 
//   apiVersion: '2006-03-01'
// });

const importFileParser = async (event) => {
  console.log('Hello from importFileParser. Event: ', event);

  const s3Client = new S3Client({region: 'eu-west-1'});

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const params = {
      Bucket: bucket,
      Key: key,
  }; 
  const results = [];
  let statusCode = 500;
  let resMessage = 'Somethins was wrong in Lambda importFileParser';

  console.log('params: ', params);
  try {
      const s3Res = await s3Client.getObject(params).promise();
      // const readStream = createReadStream(s3Res.Body);

      console.log('s3Res: ', s3Res);
      // console.log('readStream: ', readStream);

      s3Res.Body
        .pipe(csv())
        .on('data', (data) => {
          console.log(data);
          results.push(data);
        })
        .on('end', () => {
          statusCode = 200;
          resMessage = 'File read OK';
          console.log(results);
        })
        .on('error', (error) => {
          console.error(error);
          statusCode = 500;
          resMessage = 'Somethins went wrong inside S3 Readable Stream'
        })
  } catch (err) {
      console.error(err);
      statusCode = 500;
      resMessage = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
      // throw new Error(message);
  }

  return formatJSONResponse({
    resMessage,
    results
  }, statusCode)
};

export const main = importFileParser;
