module.exports = (sequelize, DataTypes) => {
  const GameRound = sequelize.define("GameRound", {
    drawnNumbers: {
      type: DataTypes.ARRAY(DataTypes.INTEGER), // Winning numbers
      allowNull: true, // Null until numbers are drawn
    },
    status: {
      type: DataTypes.ENUM("open", "closed", "completed"),
      defaultValue: "open",
    },
    startTime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true, // Set when round is completed
    },
  });

  return GameRound;
};
