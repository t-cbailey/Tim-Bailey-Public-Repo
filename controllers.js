const { selectCategories, findReviewByID } = require("./models");
const endpoints = require("./endpoints.json");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((categories) => {
      res.status(200).send({ categories });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewByID = (req, res, next) => {
  const id = req.params;
  findReviewByID(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
