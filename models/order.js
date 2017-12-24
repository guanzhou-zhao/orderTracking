var Model = require('objection').Model
var knex = require('../db')
var bcrypt = require('../lib/bcrypt')
var _ = require('lodash')

function Order () {
  Model.apply(this, arguments)
}

Model.extend(Order)
Model.knex(knex)
Order.tableName = 'orderi'
Order.getByUsername = function (username, isAdmin) {
  return isAdmin ? Order
    .query()
    .select() : Order
      .query()
      .where({username})
      .select()
}
Order.getByOrderNum = function (ordernum) {
  return Order
    .query()
    .where('ordernum', ordernum)
    .select()
}
Order.getById = function (id) {
  return Order
.query()
    .where('id', id)
}
Order.patchById = function(order) {
  var id = order.id;
  delete order.id;
  return Order
    .query()
    .patchAndFetchById(id, order)
}
Order.add = function(shopname, keyword, price, ordernum, username) {
  return Order
    .query()
    .insert({shopname, keyword, price, ordernum, username})
}
module.exports = Order
