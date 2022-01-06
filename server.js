const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection'); //import connection to Sequelize
const path = require('path');
const helpers = require('./utils/helpers');

const exphbs = require('express-handlebars');
const hbs = exphbs.create({helpers}); //summon the helpers

//connects session to sequelize database
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public'))); //for the css in public directory
/*The express.static() method is a built-in Express.js middleware function that
 can take all of the contents of a folder and serve them as static assets.
 This is useful for front-end specific files like images, style sheets, and
 JavaScript files.*/

app.use(session(sess));


//turn on routes
app.use(routes);

//turn on connection to db and server
//sync means take models and connect to associated db tables
//will create a table for you if it doesnt find one
sequelize.sync({ force: false }).then(() => { //true is basically DROP TABLE IF EXISTS
    app.listen(PORT, () => console.log('Now listening'));
});

//the router instance from routes/index.js collected and packaged all the routes