module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      full_name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      password_hash: DataTypes.STRING,
      role: DataTypes.ENUM("player", "admin"),
      balance: DataTypes.DECIMAL(10, 2),
    },
    {}
  );
  User.associate = function (models) {
    User.hasMany(models.Bet, { foreignKey: "user_id" });
    User.hasMany(models.Transaction, { foreignKey: "user_id" });
    User.hasMany(models.AdminSettings, { foreignKey: "updated_by" });
  };
  return User;
};
