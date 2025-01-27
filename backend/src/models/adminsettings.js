module.exports = (sequelize, DataTypes) => {
  const AdminSettings = sequelize.define(
    "AdminSettings",
    {
      rtp_percentage: DataTypes.DECIMAL(5, 2),
    },
    {}
  );
  AdminSettings.associate = function (models) {
    AdminSettings.belongsTo(models.User, { foreignKey: "updated_by" });
  };
  return AdminSettings;
};
