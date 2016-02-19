var profileController = require('../controllers/profileController.js');

module.exports = function(app) {
  // app === profileRouter injected from request-helper.js
  console.log(app);

  // fix function later (need to call the DB in controller)
  /*app.post('/user', profileController);*/
};
