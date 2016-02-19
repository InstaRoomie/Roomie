var path = require('path');
var helpers = require('../util/helpers.js');
var app = require('../server.js');
var morgan = require('morgan');
var bodyParser  = require('body-parser');

module.exports = function (app, express) {
  var userRouter = express.Router();
  var profileRouter = express.Router();
  var contactRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static('./public'));

  app.use('/api/users', userRouter);
  app.use('/api/profile', profileRouter);
  app.use('/api/contact', contactRouter);

  app.use(helpers.errorLogger);
  app.use(helpers.errorHandler);

  /*app.get("/", function(request, response) {
    var status = status || 200;
    console.log('This is a get request ', request);

    helpers.serveAssets(response, routes.home, function(data){
      response.writeHead(status, {'Content-Type': 'text/html'});
      response.end(data, 'utf-8');
    });
  });*/

  // inject our routers into their respective route files
  require('./userRoute.js')(userRouter);
  require('./profileRoute.js')(profileRouter);
  require('./contactRoute.js')(contactRouter);
};
