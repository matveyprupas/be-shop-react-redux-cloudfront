import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
import { ProductType } from 'src/db/products';
import { createProductService } from 'src/service/service';
import { ErrorResponse } from 'src/utils/error';
import { validateProduct } from 'src/utils/utils';

import schema from './schema';


const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('createProduct Lambda: ', event);

  try {
    const validateResult = await validateProduct(event.body as ProductType);
  
    if (validateResult.error) {
      return formatJSONResponse(validateResult.error, 400);
    }
    
    const result = await createProductService(event.body as ProductType);
    return formatJSONResponse(result);
  } catch (_err) {
    let err = _err;
    if (!(err instanceof ErrorResponse)) {
      console.error(err);
      err = new ErrorResponse('createProduct Lambda Issues. Check CloudWatch');
    }
    return err;
  }
};

export const main = middyfy(createProduct).use(cors());
