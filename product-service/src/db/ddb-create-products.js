const AWS = require('aws-sdk');
const crypto = require('crypto');

AWS.config.loadFromPath('./config.json');

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var myTable = 'serverless_products';

// Add the four results for spades
let params = {
  TableName: myTable,
  Item: {
    id: {
     S: crypto.randomUUID()
    },
    title: {
     S: "iPhone XS"
    },
    description: {
     S: "iPhone XS designed by Apple Inc."
    },
    price: {
     N: "414"
    }
   }
};
post();

params = {
  TableName: myTable,
  Item: {
    id: {
     S: crypto.randomUUID()
    },
    title: {
     S: "iPhone 14 Pro"
    },
    description: {
     S: "iPhone 14 Pro designed by Apple Inc."
    },
    price: {
     N: "1627"
    }
   }
};
post();

params = {
  TableName: myTable,
  Item: {
    id: {
     S: crypto.randomUUID()
    },
    title: {
     S: "iPhone 11"
    },
    description: {
     S: "iPhone 11 designed by Apple Inc."
    },
    price: {
     N: "417"
    }
   }
};
post();

params = {
  TableName: myTable,
  Item: {
    id: {
     S: crypto.randomUUID()
    },
    title: {
     S: "iPhone XS Max"
    },
    description: {
     S: "iPhone XS Max designed by Apple Inc."
    },
    price: {
     N: "699"
    }
   }
};
post();

params = {
  TableName: myTable,
  Item: {
    id: {
     S: crypto.randomUUID()
    },
    title: {
     S: "iPhone 13 mini"
    },
    description: {
     S: "iPhone 13 mini designed by Apple Inc."
    },
    price: {
     N: "627"
    }
   }
};
post();

function post () {
  ddb.putItem(params, function(err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}