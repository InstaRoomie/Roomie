var db = require('../db/schema.js').db;
var Profile = require('../models/profile.js');

var Profiles = new db.Collection();

Profiles.model = Profile;

module.exports = Profiles;
