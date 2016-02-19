var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'mysqlcluster7.registeredsite.com',
    user: 'iron_man',
    password: '!Qaz2wsx3edc',
    database: 'roomme_db',
    charset: 'utf8'
  }
});

var Bookshelf = require('bookshelf')(knex);
var db = Bookshelf;

knex.schema.hasTable('Users').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('Users', function(table) {
      table.increments('id').primary();
      table.string('email', 100).unique();
      table.string('firstname', 100);
      table.string('lastname', 100);
      table.string('username', 100).unique();
      table.string('password', 100);
      table.date('dob');
      table.string('image_url', 500);
      table.string('gender', 10);
      table.string('about_me', 140);
      table.timestamps();
    }).then(function(table) {
      console.log('Created Table', table);
    });
  }
});

knex.schema.hasTable('Maybe').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('Maybe', function(table) {
      table.integer('user_id').unsigned();
      table.integer('potential').unsigned();
      table.foreign('user_id').references('id').inTable('Users');
      table.foreign('potential').references('id').inTable('Users');
      table.timestamps();
    }).then(function(table) {
      console.log('Created Table', table);
    });
  }
});

knex.schema.hasTable('Yes').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('Yes', function(table) {
      table.integer('user_id').unsigned();
      table.integer('friend').unsigned();
      table.foreign('user_id').references('id').inTable('Users');
      table.foreign('friend').references('id').inTable('Users');
      table.timestamps();
    }).then(function(table) {
      console.log('Created Table', table);
    });
  }
});

knex.schema.hasTable('No').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('No', function(table) {
      table.integer('user_id').unsigned();
      table.integer('enemy').unsigned();
      table.foreign('user_id').references('id').inTable('Users');
      table.foreign('enemy').references('id').inTable('Users');
      table.timestamps();
    }).then(function(table) {
      console.log('Created Table', table);
    });
  }
});

module.exports = {
  db: db,
  knex:knex
};
