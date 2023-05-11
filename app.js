const express = require("express");
const app = express();
app.use(express.json());
const {
  getCategories,
  getReviewByID,
  getEndpoints,
  getCommentsByRevID,
  getReviews,
  patchReviewVotesByRevID,
} = require("./controllers");

app.get("/api/categories", getCategories);
app.get("/api", getEndpoints);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id", getReviewByID);
app.get("/api/reviews/:review_id/comments", getCommentsByRevID);
app.patch("/api/reviews/:review_id", patchReviewVotesByRevID);

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
