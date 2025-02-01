module.exports = (sequelize, DataTypes) => {
  const NumberAnalytics = sequelize.define(
    "NumberAnalytics",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensure each number is unique
      },
      drawnCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  return NumberAnalytics;
};
