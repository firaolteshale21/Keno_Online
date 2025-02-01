module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("GameSettings", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rtp: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 95.0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Insert default RTP setting
    await queryInterface.bulkInsert("GameSettings", [
      { rtp: 85.0, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("GameSettings");
  },
};
