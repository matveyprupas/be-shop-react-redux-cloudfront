import { formatJSONResponse } from '@libs/api-gateway';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand, SendMessageCommandInput } from "@aws-sdk/client-sqs";
const csv = require('csv-parser')

const importFileParser = async (event) => {
  const results = [];
  let statusCode = 500;
  let resMessage = 'Somethins was wrong in Lambda importFileParser';

  const bucket = event.Records[0].s3.bucket.name;
  const keyUploaded = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  
  const paramsUploaded = {
    Bucket: bucket,
    Key: keyUploaded,
  }; 

  const paramsParsed = {
      Bucket: bucket,
      Key: keyUploaded.split('uploaded').join('parsed'),
  }; 

  console.log(paramsUploaded, paramsParsed, event.Records[0].s3.object.key);

  const s3Client = new S3Client({region: 'eu-west-1'});
  const sqsClient = new SQSClient({region: 'eu-west-1'});
  const getCommand = new GetObjectCommand(paramsUploaded);
  const putCommand = new PutObjectCommand(paramsParsed);
  const deleteCommand = new DeleteObjectCommand(paramsUploaded);
  const result = await s3Client.send(getCommand);
  const objectStream: NodeJS.ReadableStream = result.Body as NodeJS.ReadableStream;

  try {
      await objectStream
        .pipe(csv())
        .on('data', async (data) => {
          console.log('chunk data after csv(): ', data);
          results.push(data);
          const sendMessageCommandInput: SendMessageCommandInput = {
            MessageBody: JSON.stringify(data),
            QueueUrl: process.env.SQS_URL
          }
          const command = new SendMessageCommand(sendMessageCommandInput);
          console.log('command after csv(): ', command);

          sqsClient.send(command, (err, data)=>{
            if(err) console.error('sqsClient Error: ', err)
            console.log('sqsClient DATA: ', data);
          });
        })
        .on('end', () => {
          statusCode = 200;
          resMessage = 'File read OK';
          console.log('results array: ', results);
        })
        .on('error', (error) => {
          console.error(error);
          statusCode = 500;
          resMessage = 'Somethins went wrong inside S3 Readable Stream'
        })
        await s3Client.send(putCommand);
        await s3Client.send(deleteCommand);
  } catch (err) {
      console.error(err);
      statusCode = 500;
      resMessage = `Error getting object ${keyUploaded} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
      throw new Error(resMessage);
  }

  return formatJSONResponse({
    resMessage,
    results
  }, statusCode)
};

export const main = importFileParser;
