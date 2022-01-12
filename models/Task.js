const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    task_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //at least 1 character long
        len: [1]
      }
    },
    task_description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //at least 1 character long
        len: [1]
      }
    },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'group',
            key: 'id'
        }
    }
  },
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'task'
  }
);

module.exports = Task;