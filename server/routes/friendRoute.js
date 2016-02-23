var friendController = require('../controllers/friendController.js');
var userController = require('../controllers/userController.js');

module.exports = function(app) {
  // app === friendRouter injected from request-helper.js
  console.log(app);

  app.get('/friend', userController.checkAuth, friendController.getFriend);
}
