import { randomUUID } from "crypto";
import { ProductType } from "src/db/products";
import { TABLE_NAME_PRODUCTS, TABLE_NAME_STOCK } from "src/utils/constants";

const awsConfig = require('../../config.json');
const AWS = require('aws-sdk');

AWS.config.update(awsConfig);

const ddb = new AWS.DynamoDB.DocumentClient();

export const scanDdb = async (params) => {
    return await ddb.scan(params, async function onScan (err, data) {
        if (err) {
          console.error('Unable to scan the table. Error: ', JSON.stringify(err));
          return;
        }
      
        console.log('Scan succeeded! Data: ', JSON.stringify(data));
      
        if (typeof data.LastEvaluatedKey !== 'undefined') {
          console.log('Scanning for more...');
          const newParams = {
            ...params,
            ExclusiveStartKey: data.LastEvaluatedKey,
          };
          ddb.scan(newParams, onScan);
        }
      }).promise();
}

export const getProductsListService = async () => {
    const paramsProducts = { TableName: TABLE_NAME_PRODUCTS };
    const paramsStock = { TableName: TABLE_NAME_STOCK };

    const products = await scanDdb(paramsProducts);
    const stock = await scanDdb(paramsStock);

    const result = products.Items.map( product => {
    const stockById = stock.Items.filter( stock => stock.product_id === product.id)[0];
        return {...product, count: stockById.count};
    });

    return result;
}

export const getProductByIdService = async (id: string) => {
    const paramsProducts = { 
        TableName: TABLE_NAME_PRODUCTS,
        Key: {
            id: id
        }
    };
    const paramsStock = { 
        TableName: TABLE_NAME_STOCK,
        Key: {
            product_id: id
        } };

    const products = await ddb.get(paramsProducts).promise();
    const stock = await ddb.get(paramsStock).promise();

    return {...products.Item, count: stock.Item.count};
}

export const createProductService = async (product: ProductType) => {
    const id = randomUUID();
    const paramsProducts = {
        TableName : TABLE_NAME_PRODUCTS,
        Item: {
            id: id,
            title: product.title || '',
            description: product.description || '',
            price: product.price || 0
        }
      };
    const paramsStock = {
        TableName : TABLE_NAME_STOCK,
        Item: {
            product_id: id,
            count: product.count || 0
        }
      };

    try {
        await ddb.put(paramsProducts, (err, data) => {
            if (err) console.log('Products error: ', err);
            else console.log('Products success: ', data);
          }).promise();
        await ddb.put(paramsStock, (err, data) => {
            if (err) console.log('Stock error: ', err);
            else console.log('Stock success: ', data);
          }).promise();

        return {
            message: 'Success',
            data: {...paramsProducts.Item, count: paramsStock.Item.count}
        };
    } catch ( err ) {
        return {
            message: 'Error',
            error: err
        };
    }
}