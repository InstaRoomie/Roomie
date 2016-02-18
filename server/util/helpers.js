var path = require('path');
var fs = require('fs');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

exports.serveAssets = function(response, asset, callback) {
  console.log('asset being served! ', asset);
  fs.readFile(asset, function(err, data){
    if (err) {
      throw err;
    }
    callback(data.toString());
  });
};
