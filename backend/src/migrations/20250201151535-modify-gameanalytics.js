module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("GameAnalytics", "id", {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
    });
    // Add other changes here if needed
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("GameAnalytics", "id", {
      type: Sequelize.INTEGER, // or the previous type
      allowNull: true,
      // Add default value if necessary
    });
  },
};
