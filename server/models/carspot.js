module.exports = (sequelize, DataTypes) => {
  const CarSpot = sequelize.define('CarSpot', {
    entry_timestamp: { type: DataTypes.DATE, allowNull: false },
    exit_timestamp: { type: DataTypes.DATE, allowNull: false },
    allocated_duration: { type: DataTypes.TIME, allowNull: false },
    occupant_id: { type: DataTypes.STRING, allowNull: false },
    spotId: { type: DataTypes.INTEGER, allowNull: false },
  });
  CarSpot.associate = function(models) {
    // associations can be defined here
    CarSpot.belongsTo(models.Spot, {
      foreignKey: 'spotId',
      onDelete: 'CASCADE',
    });
  };
  return CarSpot;
};
