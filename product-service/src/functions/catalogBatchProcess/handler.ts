import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'

const catalogBatchProcess = async (event) => {
  // console.log('catalogBatchProcess Lambda event.Records: ', event.Records);
  console.log('catalogBatchProcess Lambda event: ', event);
};

export const main = middyfy(catalogBatchProcess).use(cors());
