"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Bet extends Model {
    static associate(models) {
      // A Bet belongs to a User
      Bet.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
      // A Bet belongs to a GameRound
      Bet.belongsTo(models.GameRound, {
        foreignKey: "gameRoundId",
        as: "gameRound",
      });
    }
  }

  Bet.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      numbersChosen: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
      },
      betAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      winningAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.0,
      },
      status: {
        type: DataTypes.ENUM("pending", "won", "lost"),
        defaultValue: "pending",
      },
      gameRoundId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "GameRound",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Bet",
      tableName: "bets",
      timestamps: true,
    }
  );

  return Bet;
};
