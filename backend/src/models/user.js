"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // A User has many Bets
      User.hasMany(models.Bet, {
        foreignKey: "userId",
        as: "bets",
      });

      // A User has many Transactions
      User.hasMany(models.Transaction, {
        foreignKey: "userId",
        as: "transactions",
      });
    }
  }

 User.init(
   {
     id: {
       type: DataTypes.UUID,
       defaultValue: DataTypes.UUIDV4,
       primaryKey: true,
     },
     firstName: {
       type: DataTypes.STRING,
       allowNull: false,
     },
     lastName: {
       type: DataTypes.STRING,
       allowNull: false,
     },
     phoneNumber: {
       type: DataTypes.STRING,
       allowNull: false,
       unique: true,
       validate: {
         is: /^[0-9]{10,15}$/,
       },
     },
     password: {
       type: DataTypes.STRING,
       allowNull: false,
     },
     dateOfBirth: {
       type: DataTypes.DATEONLY,
       allowNull: false,
     },
     balance: {
       type: DataTypes.DECIMAL(10, 2),
       defaultValue: 0.0,
     },
     otpCode: {
       type: DataTypes.STRING, // Stores the temporary OTP
       allowNull: true,
     },
     otpExpiresAt: {
       type: DataTypes.DATE, // Expiration time of the OTP
       allowNull: true,
     },
   },
   {
     sequelize,
     modelName: "User",
     tableName: "users",
     timestamps: true,
   }
 );
  return User;
};
