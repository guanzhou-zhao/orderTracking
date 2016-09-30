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
  console.log('verifyUser in LocalStrategy......');
    User.getByUsername(username)
    .then(function(users) {
      var user = _.first(users)
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      } else if (!bcrypt.compareHash(password, user.hash)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    })
}
User.serializeUser = function(user, done) {
  console.log('serialize user......');
  done(null, user);
}
User.deserializeUser = function(user, done) {
  console.log('deserialize user......');
  User.getById(user.id)
    .then(function (users) {
      var duser = _.first(users)
      done(null, duser)
    })
}
module.exports = User
