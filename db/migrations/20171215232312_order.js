
exports.up = function(knex, Promise) {
  console.log('migrate order...')
  return knex.schema.createTableIfNotExists('orderi', function (table) {
    table.collate('utf8_general_ci')
    table.charset('utf8')
    table.increments('id').primary()
    table.string('shopname').notNullable()
    table.string('keyword').notNullable()
    table.decimal('price').notNullable()
    table.string('ordernum').notNullable()
    table.string('username').notNullable()
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('orderi')
};
