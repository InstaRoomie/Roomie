var path = require('path');
var helpers = require('../util/helpers.js');
var app = require('../server.js');
var morgan = require('morgan');
var bodyParser  = require('body-parser');

var routes = {
  home: '../../public/index.html',
};

module.exports = function (app, express) {
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static('./public'));

  app.get("/", function(request, response) {
    var status = status || 200;
    console.log('This is a get request ', request);

    helpers.serveAssets(response, routes.home, function(data){
      response.writeHead(status, {'Content-Type': 'text/html'});
      response.end(data, 'utf-8');
    });
  });

  // inject our routers into their respective route files
  /*require('....')(...Router);
  require('...'')(..Router);*/
};
