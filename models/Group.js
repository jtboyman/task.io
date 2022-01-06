const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');

class Group extends Model {}

Group.init(
    {
        id: {
            //use the special sequelize DataTypes object provide what type of data
            type: DataTypes.INTEGER,
            //equiv to SQL's NOT NULL option
            allowNull: false,
            //instruct that this is the Primary Key
            primaryKey: true,
            //autoincrement
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //at least 1 character long
                len: [1]
            }
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'group'
    }
)

module.exports = Group;