const path = require("path");
const express = require("express");

const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const routes = require("./controllers/");

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});
