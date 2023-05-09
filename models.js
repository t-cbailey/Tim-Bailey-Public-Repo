const connection = require("./db/connection");
exports.selectCategories = () => {
  return connection
    .query(
      `
    SELECT * FROM categories;
    `
    )
    .then((res) => {
      return res.rows;
    });
};

exports.findReviewByID = (id) => {
  const arr = [parseInt(id.review_id)];
  return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1`, arr)
    .then((res) => {
      return res.rows.length === 0
        ? Promise.reject({ status: 404, msg: "Invalid input!" })
        : res.rows;
    });
};
