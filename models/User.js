const {Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

//create our User model
class User extends Model {
    //set up method to run on instacne data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password); //normally use async
    }
}

//define table columns and configuration with two object arguments
User.init(
    {
        //TABLE COLUMN DEFINITIONS (obj 1)
        //define an id column
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
        //define username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        //define email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            //there cannot be any duplicate emails
            unique: true,
            //if allowNull is set to false, we can run data through validators b4 creating data
            validate: {
                isEmail: true
            }
        },
        //password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                //4 chars long
                len: [4]
            }
        }
    },
    {
        //TABLE CONFIGURATION OPTIONS (obj 2) (https://sequelize.org/v5/manual/models-definition.html#configuration))
        hooks: {
            //set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            //set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) { //need to add option to query in user-routes for this one bc update according to docs
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        //pass in imported sequelize connection (the direct connection to our database)
        sequelize,
        //don't automatically create timestamps
        timestamps: false,
        //don't pluralize name of database table
        freezeTableName: true,
        //use underscores instead of camelcasing
        underscored: true,
        //make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;