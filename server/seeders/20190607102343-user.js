const bcrypt = require('bcrypt');

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'admin',
          email: 'admin@driveway.com',
          bio: 'Admin',
          location: 'Nigeria',
          password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { individualHooks: true }
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('Users', null, {}),
};
