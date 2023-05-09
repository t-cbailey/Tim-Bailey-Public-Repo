const { selectCategories } = require("./models");

exports.getCategories = (req, res, next) => {
  console.log("in controllers");
  selectCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};
