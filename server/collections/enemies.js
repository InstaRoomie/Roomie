var db = require('../db/schema.js').db;
var Enemy = require('../models/enemy.js');

var Enemies = new db.Collection();

Enemies.model = Enemy;

module.exports = Enemies;
