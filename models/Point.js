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
    admin_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'admin',
        key: 'id'
      }
    },
    team_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'team',
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