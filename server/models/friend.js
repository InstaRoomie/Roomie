var db = require('../db/schema.js');
var Promise = require('bluebird');

var Friend = db.Model.extend({
  tableName: 'Yes',
  hasTimestamps: true,
  initialize: function() {
    console.log('Friend is created!')
  },
  user: function() {
    return this.belongsTo(User, 'id');
  }
});

module.exports = Friend;
