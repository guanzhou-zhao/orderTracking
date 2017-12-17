var Knex = require('knex')
// by default we use the devlopment config in the knexfile
// in production knex will be configured to use postgresql
console.log(`using knex configuration of ${process.env.NODE_ENV}`)
var config = require('../knexfile')[process.env.NODE_ENV || 'development']

module.exports = Knex(config)
