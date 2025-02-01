"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      // A Transaction belongs to a User
      Transaction.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      // A Transaction may belong to a Bet (for tracking game transactions)
      Transaction.belongsTo(models.Bet, {
        foreignKey: "betId",
        as: "bet",
      });
    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      betId: {
        type: DataTypes.UUID,
        allowNull: true, // Only used when a transaction is linked to a bet
        references: {
          model: "bets",
          key: "id",
        },
      },
      type: {
        type: DataTypes.ENUM("deposit", "withdrawal", "payout", "bet"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
      paymentProvider: {
        type: DataTypes.STRING,
        allowNull: true, // Null means it's an internal transaction (e.g., a bet)
      },
      externalTransactionId: {
        type: DataTypes.STRING,
        allowNull: true, // Used for tracking third-party payments
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Transaction",
      tableName: "transactions",
      timestamps: true,
    }
  );

  return Transaction;
};
