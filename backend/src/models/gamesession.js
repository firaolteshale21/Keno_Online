module.exports = (sequelize, DataTypes) => {
  const GameSession = sequelize.define(
    "GameSession",
    {
      draw_numbers: DataTypes.ARRAY(DataTypes.INTEGER),
    },
    {}
  );
  GameSession.associate = function (models) {
    GameSession.hasMany(models.Bet, { foreignKey: "game_session_id" });
    GameSession.hasOne(models.RTPLog, { foreignKey: "game_session_id" });
  };
  return GameSession;
};
