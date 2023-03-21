import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
import { getProductByIdService } from 'src/service/service';
import { ErrorResponse } from 'src/utils/error';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('getProductsById Lambda: ', event);

  try {
    const id = event.pathParameters.productId.toLowerCase();
    return formatJSONResponse(await getProductByIdService(id));
  } catch (_err) {
    let err = _err;
    if (!(err instanceof ErrorResponse)) {
      console.error(err);
      err = new ErrorResponse('getProductsById Lambda Issues. Check CloudWatch');
    }
    return err;
  }
};

export const main = middyfy(getProductsById).use(cors());
