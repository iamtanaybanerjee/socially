// models/user.js

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  user.associate = (models) => {
    user.hasMany(models.post, { foreignKey: "userId" });
  };

  return user;
};
