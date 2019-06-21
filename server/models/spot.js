module.exports = (sequelize, DataTypes) => {
  const Spot = sequelize.define('Spot', {
    spotname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'free',
    },
    parkId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Spot.associate = function(models) {
    // associations can be defined here
    Spot.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
/** Spot.hasOne(models.CarSpot,{
foreignKey: 'spotId',
      onDelete: 'CASCADE',
});**/
    Spot.belongsTo(models.Park, {
      foreignKey: 'parkId',
      onDelete: 'CASCADE'
    });
  };
  return Spot;
};