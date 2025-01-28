module.exports = (sequelize, DataTypes) => {
  const GameSession = sequelize.define(
    "GameSession",
    {
      draw_numbers: DataTypes.ARRAY(DataTypes.INTEGER),
      status: DataTypes.ENUM("waiting", "in_progress", "completed"),
      players: DataTypes.ARRAY(DataTypes.INTEGER), // Stores user IDs of players in the session
    },
    {}
  );
  GameSession.associate = function (models) {
    GameSession.hasMany(models.Bet, { foreignKey: "game_session_id" });
    GameSession.hasOne(models.RTPLog, { foreignKey: "game_session_id" });
  };
  return GameSession;
};
