module.exports = (sequelize, DataTypes) => {
  const post = sequelize.define(
    "post",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      likeCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      visitorCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        references: { model: "user", key: "id" },
      },
    },
    {
      timestamps: true,
    }
  );

  post.associate = (models) => {
    post.belongsTo(models.user, { foreignKey: "userId" });
  };
  return post;
};
