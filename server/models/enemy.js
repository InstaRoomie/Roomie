var db = require('../db/schema.js');
var Promise = require('bluebird');

var Enemy = db.Model.extend({
  tableName: 'No',
  hasTimestamps: true,
  initialize: function() {
    console.log('Enemy is created!')
  }
});

module.exports = Enemy;
