//this is a through table for the many to many relationship of many users doing many votes
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Point extends Model {}

Point.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    }
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'point'
  }
);

module.exports = Point;