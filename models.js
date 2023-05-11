const { response } = require("express");
const connection = require("./db/connection");

exports.selectCategories = () => {
  return connection.query(`SELECT * FROM categories;`).then((res) => {
    return res.rows;
  });
};

exports.findReviewByID = (id) => {
  const arr = [parseInt(id.review_id)];
  return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1`, arr)
    .then((res) => {
      return res.rows.length === 0
        ? Promise.reject({ status: 404, msg: "Nothing Found!" })
        : res.rows;
    });
};

exports.postReviewComment = (id, data) => {
  const review_id = parseInt(id.review_id);
  const { username, body } = data;
  if (
    !data.hasOwnProperty("username") ||
    !data.hasOwnProperty("body") ||
    typeof data.body != "string" ||
    Object.keys(data).length > 2
  ) {
    return Promise.reject({ status: 400, msg: "Unsupported body format" });
  } else {
    return connection
      .query(
        `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, body, review_id]
      )
      .then((res) => {
        return res.rows;
      });
  }
};
