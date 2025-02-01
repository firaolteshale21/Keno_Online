"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the column exists before trying to change it
    const tableInfo = await queryInterface.describeTable("GameSettings");

    // Modify or add RTP column
    await queryInterface.changeColumn("GameSettings", "rtp", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 85.0,
    });

    // Add volatility column if it does not exist
    if (!tableInfo.volatility) {
      await queryInterface.addColumn("GameSettings", "volatility", {
        type: Sequelize.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
      });
    } else {
      // If it exists, you can change it
      await queryInterface.changeColumn("GameSettings", "volatility", {
        type: Sequelize.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // Optionally, revert the changes made in the up method
    await queryInterface.removeColumn("GameSettings", "volatility");

    await queryInterface.changeColumn("GameSettings", "rtp", {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: null, // or whatever the previous default was
    });
  },
};
