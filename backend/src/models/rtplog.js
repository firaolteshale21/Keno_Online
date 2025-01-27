module.exports = (sequelize, DataTypes) => {
  const RTPLog = sequelize.define(
    "RTPLog",
    {
      total_deposits: DataTypes.DECIMAL(10, 2),
      total_payouts: DataTypes.DECIMAL(10, 2),
      rtp_percentage: DataTypes.DECIMAL(5, 2),
    },
    {}
  );
  RTPLog.associate = function (models) {
    RTPLog.belongsTo(models.GameSession, { foreignKey: "game_session_id" });
  };
  return RTPLog;
};
