"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("bets", "gameRoundId", {
      type: Sequelize.UUID, // Change to UUID to match GameRounds.id
      allowNull: false,
      references: {
        model: "GameRounds", // Ensure the model name matches exactly
        key: "id",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("bets", "gameRoundId");
  },
};
