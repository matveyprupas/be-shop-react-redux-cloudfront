import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
import { ProductType } from 'src/db/products';
import { createProductService } from 'src/service/service';

import schema from './schema';


const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const result = await createProductService(event.body as ProductType);
  return formatJSONResponse(result);
};

export const main = middyfy(createProduct).use(cors());
