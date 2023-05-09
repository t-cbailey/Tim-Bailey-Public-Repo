const express = require("express");
const app = express();
const { getCategories } = require("./controllers");

app.get("/api/categories", getCategories);

app
  .use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  })
  .use((req, res, next) =>
    res.status(404).send({ msg: "Sorry can't find that!" })
  );
module.exports = app;
