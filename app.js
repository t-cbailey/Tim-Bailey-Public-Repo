const express = require("express");
const app = express();
const { getCategories, getReviewByID, getEndpoints } = require("./controllers");

app.get("/api/categories", getCategories);
app.get("/api", getEndpoints);

app.get("/api/reviews/:review_id", getReviewByID);

app
  .use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
  })
  .use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(404).send({ msg: "ID must be a number" });
    } else next(err);
  })
  .use((req, res, next) =>
    res.status(404).send({ msg: "Sorry can't find that!" })
  );
module.exports = app;