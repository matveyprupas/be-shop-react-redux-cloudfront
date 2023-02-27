import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'

import schema from './schema';
const products = require('../../db/products.json')

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const id = event.pathParameters.productId.toLowerCase();
  
  const product: ProductType = products.filter( (product: ProductType) => {
    const productId = product.title.toLowerCase().split(' ').join('');
    return productId === id;
  })[0]

  return formatJSONResponse(product);
};

export const main = middyfy(getProductsById).use(cors());
