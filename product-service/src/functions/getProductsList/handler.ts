import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import cors from '@middy/http-cors'
import { getProductsListService } from 'src/service/service';
import { ErrorResponse } from 'src/utils/error';

import schema from './schema';


const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('getProductsList Lambda: ', event);

  try {
    return formatJSONResponse(await getProductsListService());
  } catch (_err) {
    let err = _err;
    if (!(err instanceof ErrorResponse)) {
      console.error(err);
      err = new ErrorResponse('getProductsList Lambda Issues. Check CloudWatch');
    }
    return err;
  }
};

export const main = middyfy(getProductsList).use(cors());
