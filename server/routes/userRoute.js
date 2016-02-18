var userController = require('../models/user/userController.js');

module.exports = function (app) {
  // app === userRouter injected from request-helper.js
  console.log(app);

  // fix function later (need to call the DB in controller)
  /*app.post('/signin', userController); // userController.signin
  app.post('/signup', userController); // userController.signup
  app.get('/signedin', userController); // userController.checkAuth*/
};
