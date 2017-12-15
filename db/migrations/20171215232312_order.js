
exports.up = function(knex, Promise) {
  console.log('migrate order...')
  return knex.schema.createTableIfNotExists('order', function (table) {
    table.integer('id').primary()
    table.string('shopname').notNullable()
    table.string('keyword').notNullable()
    table.decimal('price').notNullable()
    table.string('ordernum').notNullable()
    table.string('username').notNullable()
    table.timestamp('date').notNullable().defaultTo(knex.fn.now())
    table.timestamps(true, true)
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('order')
};
