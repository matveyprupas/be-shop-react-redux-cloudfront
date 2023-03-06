import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
import { getProductByIdService } from 'src/service/service';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id = event.pathParameters.productId.toLowerCase();
  return formatJSONResponse(await getProductByIdService(id));
};

export const main = middyfy(getProductsById).use(cors());
