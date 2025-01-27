"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("RTPLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      total_deposits: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      total_payouts: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      rtp_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      game_session_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "GameSessions",
          key: "id",
        },
        onDelete: "CASCADE",
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("RTPLogs");
  },
};
