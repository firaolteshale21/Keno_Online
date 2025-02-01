module.exports = (sequelize, DataTypes) => {
  const GameSetting = sequelize.define("GameSetting", {
    rtp: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 85.0, // Default RTP = 85%
    },
    volatility: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium", // ✅ Default volatility setting
    },
  });

  return GameSetting;
};
