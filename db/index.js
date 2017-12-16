var Knex = require('knex')
// by default we use the devlopment config in the knexfile
// in production knex will be configured to use postgresql
var config = require('../knexfile').development

module.exports = Knex(config)
