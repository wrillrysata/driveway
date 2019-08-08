module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('CarSpots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      entry_timestamp: {
        type: Sequelize.DATE,
      },
      exit_timestamp: {
        type: Sequelize.DATE,
      },
      allocated_duration: {
        type: Sequelize.INTEGER,
      },
      occupant_id: {
        type: Sequelize.STRING,
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Spots',
          key: 'id',
          as: 'spotId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('CarSpots'),
};
