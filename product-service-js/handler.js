'use strict';

const products = require('./products.json')

module.exports.getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(products)
  };
};
