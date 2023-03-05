const AWS = require('aws-sdk');
const crypto = require('crypto');

AWS.config.loadFromPath('./config.json');

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const productsTable = 'serverless_products';
const stockTable = 'serverless_stock';

let itemsIds = [];

ddb.scan({TableName: productsTable}, (err, data) => {
  if (err) {
    console.log("Error", err);
  } else {
    itemsIds = data.Items.map(el => el.id);
    itemsIds.forEach( (el, i) => {
      let params = {
        TableName: stockTable,
        Item: {
          product_id: el,
          count: {
            N: `${i ? Math.floor(Math.random()*1000) : 2}`
          }
          }
      };
      console.log(params);
      post(params);
    });
    console.log("Success", itemsIds);
  }
});

function post (params) {
  ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}