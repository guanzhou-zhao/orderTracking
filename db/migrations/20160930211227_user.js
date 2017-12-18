
exports.up = function(knex, Promise) {
  console.log('migrate user...')
  return knex.schema.createTableIfNotExists('user', function (table) {
    table.collate('utf8_general_ci')
    table.charset('utf8')
    table.increments('id').primary()
    table.string('username')
    table.string('email')
    table.string('hash')
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user')
};
