var db = require('../db/schema.js').db;
var Contact = require('../models/profile.js');

var Contacts = new db.Collection();

Contacts.model = Contact;

module.exports = Contacts;
