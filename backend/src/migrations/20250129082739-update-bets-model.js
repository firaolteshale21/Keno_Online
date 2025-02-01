module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("bets", "userId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    });
    await queryInterface.renameColumn(
      "bets",
      "selectedNumbers",
      "numbersChosen"
    );
    await queryInterface.renameColumn("bets", "amount", "betAmount");
    await queryInterface.renameColumn("bets", "payout", "winningAmount");
    await queryInterface.addColumn("bets", "status", {
      type: Sequelize.ENUM("pending", "won", "lost"),
      defaultValue: "pending",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("bets", "status");
    await queryInterface.renameColumn(
      "bets",
      "numbersChosen",
      "selectedNumbers"
    );
    await queryInterface.renameColumn("bets", "betAmount", "amount");
    await queryInterface.renameColumn("bets", "winningAmount", "payout");
    await queryInterface.changeColumn("bets", "userId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },
};
