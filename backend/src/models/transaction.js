module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      type: DataTypes.ENUM("deposit", "withdrawal", "payout"),
      amount: DataTypes.DECIMAL(10, 2),
    },
    {}
  );
  Transaction.associate = function (models) {
    Transaction.belongsTo(models.User, { foreignKey: "user_id" });
  };
  return Transaction;
};
