"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("GameRounds", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      drawnNumbers: {
        type: Sequelize.ARRAY(Sequelize.INTEGER), // Winning numbers
        allowNull: true, // Null until numbers are drawn
      },
      status: {
        type: Sequelize.ENUM("open", "closed", "completed"),
        defaultValue: "open",
      },
      startTime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true, // Set when round is completed
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("GameRounds");
  },
};
