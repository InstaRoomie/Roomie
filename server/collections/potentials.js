var db = require('../db/schema.js');
var Potential = require('../models/potential.js');

var Potentials = new db.Collection();

Potentials.model = Potential;

module.exports = Potentials;
