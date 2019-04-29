import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {}
  );

  {
    {
      user => {
        user.password = bcrypt.hashSync(user.password, 10);
      };
    }
  }

  User.associate = models => {
    // associations can be defined here
    // User.hasMany(models.Park, { foreignKey: 'userId', onDelete: 'CASCADE' });
  };
  return User;
};
