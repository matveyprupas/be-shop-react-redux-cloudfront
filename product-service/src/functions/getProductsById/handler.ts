import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
import { getOneProductsById } from 'src/utils/utils';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id = event.pathParameters.productId.toLowerCase();

  const product = await getOneProductsById(id);

  return formatJSONResponse(product);
};

export const main = middyfy(getProductsById).use(cors());
