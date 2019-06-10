module.exports = (sequelize, DataTypes) => {
  const Park = sequelize.define('Park', {
    parkname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
    initialSpots: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Park.associate = function(models) {
    // associations can be defined here
    Park.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Park.hasMany(models.Spot, {
      foreignKey: 'parkId',
      onDelete: 'CASCADE',
    });
  };
  return Park;
};