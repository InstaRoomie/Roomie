var contactController = require('../controllers/contactController.js');

module.exports = function(app) {
  // app === contactRouter injected from request-helper.js
  console.log(app);

  // fix function later (need to call the DB in controller)
  app.post('/yes'); //contactController.addYes
};
