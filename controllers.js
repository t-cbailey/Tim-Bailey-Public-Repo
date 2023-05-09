const { selectCategories } = require("./models");
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

exports.getEndpoints = (req, res, next) => {
  res.status(200).send({ endpoints });
};
