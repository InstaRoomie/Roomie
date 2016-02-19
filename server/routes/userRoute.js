var userController = require('../controllers/userController.js');
var profileController = require('../controllers/profileController.js');

module.exports = function(app) {
  // app === userRouter injected from request-helper.js
  console.log(app);

  // fix function later (need to call the DB in controller)
  app.post('/signin', userController.signin); // userController.signin
  app.post('/signup', userController.signup); // userController.signup
  app.get('/main', userController.checkAuth, profileController.getUser); // userController.checkAuth
};
