const express = require("express");
const app = express();
const { getCategories } = require("./controllers");

app.get("/api/categories", getCategories);

app.use((req, res, next) =>
  res.status(404).send({ msg: "Sorry can't find that!" })
);
module.exports = app;
