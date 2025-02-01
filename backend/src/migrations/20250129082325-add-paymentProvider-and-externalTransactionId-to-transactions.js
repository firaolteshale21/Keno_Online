module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("transactions", "paymentProvider", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("transactions", "externalTransactionId", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("transactions", "paymentProvider");
    await queryInterface.removeColumn("transactions", "externalTransactionId");
  },
};
