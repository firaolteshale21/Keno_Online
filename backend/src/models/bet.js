module.exports = (sequelize, DataTypes) => {
  const Bet = sequelize.define(
    "Bet",
    {
      selected_numbers: DataTypes.ARRAY(DataTypes.INTEGER),
      bet_amount: DataTypes.DECIMAL(10, 2),
      payout: DataTypes.DECIMAL(10, 2),
    },
    {}
  );
  Bet.associate = function (models) {
    Bet.belongsTo(models.User, { foreignKey: "user_id" });
    Bet.belongsTo(models.GameSession, { foreignKey: "game_session_id" });
  };
  return Bet;
};
