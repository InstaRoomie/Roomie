var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '173.194.251.156',
    user: 'roomie-db',
    password: 'password',
    database: 'mysql',
    charset: 'utf8'
  }
});

var Bookshelf = require('bookshelf')(knex);

knex.schema.hasTable('users').then(function(exists) {
  if (!exists) {
    knex.schema.createTable('users', function(user) {
      user.increments('id').primary();
      user.string('username', 100).unique();
      user.string('password', 100);
      user.timestamps();
    }).then(function(table) {
      console.log('Created Table', table);
    });
  }
});
