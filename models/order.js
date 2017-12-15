var Model = require('objection').Model
var knex = require('../db')
var bcrypt = require('../lib/bcrypt')
var _ = require('lodash')

function Order () {
  Model.apply(this, arguments)
}

Model.extend(Order)
Model.knex(knex)
Order.tableName = 'order'

Order.getByOrdername = function (username) {
  return Order
.query()
    .where('username', username)
    .select()
}
Order.getById = function (id) {
  return Order
.query()
    .where('id', id)
}
Order.add = function(username, password) {
  var hash = bcrypt.hash(password)
  return Order
.query()
    .insert({username, hash})
}
module.exports = Order
