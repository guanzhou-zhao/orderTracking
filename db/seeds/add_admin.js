var bcrypt = require('../../lib/bcrypt')

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  console.log(`database seeding admin, hash: ${bcrypt.hash('s39_p123K')}`);
  return knex('user').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('user').insert({
            username: 'rosfiled',
            role: 100,
            displayname: '赵冠雅',
            contact: 'zgy586',
            comment: '手机号：18898798123；地址：洛阳',
            hash: bcrypt.hash('s39_p123K')
          })
      ]);
    });
};
