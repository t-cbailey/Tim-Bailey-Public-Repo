const express = require("express");
const app = express();
app.use(express.json());
const {
  getCategories,
  getReviewByID,
  getEndpoints,
  postReviewCommentById,
} = require("./controllers");

app.get("/api/categories", getCategories);
app.get("/api", getEndpoints);
app.get("/api/reviews/:review_id", getReviewByID);
app.post("/api/reviews/:review_id/comments", postReviewCommentById);

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
  .use((err, req, res, next) => {
    if (err.code === "23503") {
      res.status(404).send({ msg: "Review or user not found" });
    } else next(err);
  })
  .use((err, req, res, next) => {
    if (err.code === "23502") {
      res.status(400).send({ msg: "Unsupported body format" });
    } else next(err);
  })
  .use((req, res, next) =>
    res.status(404).send({ msg: "Sorry can't find that!" })
  );
module.exports = app;
