var db = require('../db/schema.js');
var Promise = require('bluebird');

var Potential = db.Model.extend({
  tableName: 'Maybe',
  hasTimestamps: true,
  initialize: function() {
    console.log('Potential is created!')
  },
  user: function() {
    return this.belongsTo(User, 'id');
  }
});

module.exports = Potential;
