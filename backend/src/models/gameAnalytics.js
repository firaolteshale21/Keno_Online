module.exports = (sequelize, DataTypes) => {
  const GameAnalytics = sequelize.define("GameAnalytics", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // ✅ Ensure ID is auto-generated
      primaryKey: true,
    },
    gameRoundId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "GameRound",
        key: "id",
      },
    },
    totalBets: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    totalPayouts: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    netProfit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    actualRTP: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
  });

  return GameAnalytics;
};
