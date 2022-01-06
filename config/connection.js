//set up the app to connect to the database using sequelize

//import the Sequelize constructor from the library
const Sequelize = require('sequelize');

//user to hide info and allow process.env stuff (remember to ignore)
require('dotenv').config();

//create connection to our database and also have access to heroku process.env.JAWSDB_URL
let sequelize;

if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
  });
}

module.exports = sequelize;

/*imports the base Sequelize class and uses it to 
create a new connection to the database. The new Sequelize() function accepts 
the database name, MySQL username, and MySQL password (respectively) as 
parameters, then we also pass configuration settings. 
then export the connection.*/