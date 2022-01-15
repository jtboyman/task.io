const router = require("express").Router();
const sequelize = require("../../config/connection");
const { Task, Team, User, Admin, Point } = require("../../models");

router.get("/", (req, res) => {});

router.post("/", (req, res) => {});

router.delete("/:id", (req, res) => {});

module.exports = router;
