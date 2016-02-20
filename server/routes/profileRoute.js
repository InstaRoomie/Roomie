var buttonController = require('../controllers/buttonController.js');
var userController = require('../controllers/userController.js');

module.exports = function(app) {
  // app === profileRouter injected from request-helper.js

  // fix function later (need to call the DB in controller)
  app.post('/no', userController.checkAuth, buttonController.getUser, buttonController.addNo); // profileController.addNo
  app.post('/yes', userController.checkAuth, buttonController.getUser, buttonController.addMaybe); // profileController.addYes
};
