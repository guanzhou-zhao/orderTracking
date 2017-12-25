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
User.delById = function (id) {
  return User
    .query()
    .deleteById(id)
}
User.patchById = function(user) {
  var id = user.id;
  delete user.id;
  return User
    .query()
    .patchAndFetchById(id, user)
}
User.add = function(newuser) {
  newuser.hash = bcrypt.hash(newuser.password)
  delete newuser.password
  console.log(`======= model user.add newuser: ${JSON.stringify(newuser)}`)
  return User.query()
    .insert(newuser)
}
User.patchPass = function(id, old_pass, new_pass) {
  console.log(`===_ model user patchPass, id:old_pass:new_pass  ${id}:${old_pass}:${new_pass} ${bcrypt.hash(old_pass)}`)
  return User
    .getById(id)
    .then(function (users) {
      var user = _.isEmpty(users) ? null : _.first(users)
      if(bcrypt.compareHash(old_pass, user.hash)) {
        console.log(`===_ model user patchPass, old_pass is correct`)
        return User
          .query()
          .patchAndFetchById(id, {hash: bcrypt.hash(new_pass)})
      } else {
        return new Promise(function(resolve, reject) {
          resolve(null)
        })
      }
    })
  return User
    .query()
    .patch({hash: bcrypt.hash(new_pass)})
    .where({id, hash: bcrypt.hash(old_pass)})
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
