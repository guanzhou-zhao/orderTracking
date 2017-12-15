
exports.up = function(knex, Promise) {
  console.log('migrate order...')
  return knex.schema.createTableIfNotExists('order', function (table) {
    table.integer('id').primary()
    table.string('name')
    table.string('keyword')
    table.decimal('price')
    table.string('ordernum')
    table.timestamp('date').notNullable().defaultTo(knex.fn.now())
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('order')
};
