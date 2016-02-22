var path = require('path');
var helpers = require('../util/helpers.js');
var app = require('../server.js');
var morgan = require('morgan');
var bodyParser  = require('body-parser');

module.exports = function(app, express) {
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

  // inject our routers into their respective route files
  require('./userRoute.js')(userRouter);
  require('./profileRoute.js')(profileRouter);
  require('./friendRoute.js')(contactRouter);
};
