'use strict';
const bcrypt = require('bcryptjs');
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345679',
};
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkInsert(
        'Users',
        [
          {
            name: SEED_USER.name,
            email: SEED_USER.email,
            password: bcrypt.hashSync(
              SEED_USER.password,
              bcrypt.genSaltSync(10),
              null
            ),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        {}
      )
      .then((userId) =>
        queryInterface.bulkInsert(
          'Todos',
          Array.from({ length: 10 }).map((_, i) => ({
            name: `name-${i}`,
             isDone: false,
            UserId: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
          {}
        )
      );
  },
  // queryInterface.bulkInsert 來做大量資料的寫入，用 queryInterface.bulkDelete 做多筆資料刪除。
  down: (queryInterface, Sequelize) => {
    return queryInterface
      .bulkDelete('Todos', null, {})
      .then(() => queryInterface.bulkDelete('Users', null, {}));
  },
};
