var Model = require('objection').Model
var knex = require('../db')
var bcrypt = require('../lib/bcrypt')
var _ = require('lodash')

function User () {
  Model.apply(this, arguments)
}

Model.extend(User)
Model.knex(knex)
User.tableName = 'user'
User.getAllUsers = function () {
  return User.query()
}
User.getByUsername = function (username) {
  return User.query()
    .where('username', username)
    .select()
}
User.getById = function (id) {
  return User.query()
    .where('id', id)
}
User.add = function(username, password) {
  var hash = bcrypt.hash(password)
  return User.query()
    .insert({username, hash})
}
User.verifyUser = function(username, password, done) {
  console.log(`verifyUser in LocalStrategy...... username: ${username} password: ${password} `);
    User.getByUsername(username)
    .then(function(users) {
      var user = _.first(users)
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else {
        console.log(`user: ${JSON.stringify(user)}`)
        if (!bcrypt.compareHash(password, user.hash)) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      }
    })
}
User.serializeUser = function(user, done) {
  console.log('serialize user......');
  done(null, user);
}
User.deserializeUser = function(user, done) {
  console.log('deserialize user......');
  try {
    User.getById(user.id)
      .then(function (users) {
        var duser = _.isEmpty(users) ? null : _.first(users)
        done(null, duser)
      })
  } catch(e) {
  }
}
module.exports = User
