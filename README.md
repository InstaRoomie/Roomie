# Roomie #

---


Table of Contents
-----------------

1. [About](#about)
2. [Demo](#demo)
3. [Getting Started](#getting-started)
4. [Usage](#usage)
5. [Structure](#structure)
6. [Troubleshooting](#troubleshooting)
7. [Contributing](#contributing)


About
--------

Roomie is a simple, Tinder-esque app to find roommates that you'll get along with. You only get the ability to chat with someone else if there is mutual interest.

Some technologies we used:
  * [Angular](https://facebook.github.io/react/) for data binding and performant UI
  * [AngularUI Router](https://github.com/angular-ui/ui-router)  for routing
  * [AngularFire](https://github.com/firebase/angularfire) for setting up realtime chat using Firebase
  * [Angular Material](https://github.com/angular/material) Angular components implementing Google's Material Design
  * [mySQL](https://github.com/felixge/node-mysql) database with [BookShelf](https://github.com/tgriesser/bookshelf) ORM
  * [bcrypt](https://www.npmjs.com/package/bcrypt-nodejs) and [jwt-simple](https://www.npmjs.com/package/jwt-simple) for user authentication
  * [Node](https://nodejs.org/en/)/[Express](http://expressjs.com/en/index.html) server
  * [Firebase](https://www.firebase.com/) authentication for Github/Facebook/Twitter/Google login


Demo
----

Check out [Roomie](https://instaroomiedev.herokuapp.com).


Getting Started
---------------

Clone the repo and install the necessary node modules:

```shell
$ git clone https://github.com/InstaRoomie/Roomie.git
$ cd roomie
$ npm install       # Install Node modules listed in ./package.json
$ bower install     # Install Bower Components listed in ./bower.json
```


Usage
-----

#### `npm start` (alias for `npm run dev`)
Runs the server (by default found at `localhost:3468`).


Structure
---------

```
.
├── dist                  # Concatenated code
├── public                # Client-facing source code
|   ├── app               # Application source code
│   |    ├── auth         # Components that dictate authentication structure
│   |    ├── chat         # Components that dictate chat structure
│   |    ├── contact      # Components that dictate user contacts structure
│   |    ├── home         # Component that dictates the home page
│   |    ├── main         # Components that dictates the main application structure
│   |    ├── profile      # Components that dictate user profile structure
│   |    ├── services     # Factories that communicate server-side
│   |    └── app.js       # Application bootstrap and rendering
│   ├── assets            # Images for application
│   ├── dist              # Minified code for deployment
│   ├── index.html        # Parent view
|   └── style.css         # Styling
├── server                # Server-side source code
|   ├── collections       # BookShelf.js collection of users/friends/enemies/potentials
|   ├── controllers       # Server controllers that interact with client side actions
|   ├── db                # Database schema built with BookShelf.js
|   ├── models            # BookShelf.js models of users/friends/enemies/potentials
|   ├── routes            # Routing for server side interaction
|   ├── util              # General helper functions
|   └── server.js         # Sever bootstrap
└── index.js              # Starts the Express server
```



Troubleshooting
---------------

Having an issue? Please let us know! Report it and we'll get to it as soon as possible.


Contributing
------------

If you would like to submit a pull request, please make an effort to follow the guide in [CONTRIBUTING.md](CONTRIBUTING.md).

Thanks for checking our app out!

– InstaRoomie Dev Team (Bobby, Daniel, Danny, & Ethaniel)
