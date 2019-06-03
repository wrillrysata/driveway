module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Users', 'token', {
      type: Sequelize.TEXT,
      allowNull: true,
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Users', 'token'),
};
