var db = require('../db/schema.js');
var Promise = require('bluebird');
var User = require('../models/user.js')

var Enemy = db.Model.extend({
  tableName: 'No',
  hasTimestamps: true,
  initialize: function() {
    console.log('Enemy is created!')
  },
  user: function() {
    return this.belongsTo(User, 'id');
  }
});

module.exports = Enemy;
