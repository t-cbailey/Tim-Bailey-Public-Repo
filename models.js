const { response } = require("express");
const connection = require("./db/connection");

exports.selectCategories = () => {
  return connection.query(`SELECT * FROM categories;`).then((res) => {
    return res.rows;
  });
};

exports.selectReviews = () => {
  return connection
    .query(
      `SELECT owner, title, category, review_img_url, reviews.created_at, reviews.votes, designer,reviews.review_id, COUNT (comments.review_id) AS comment_count FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at ASC;`
    )
    .then((res) => {
      return res.rows;
    });
};

exports.findReviewByID = (id) => {
  const arr = [id.review_id];
  return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1`, arr)
    .then((res) => {
      return res.rows.length === 0
        ? Promise.reject({ status: 404, msg: "Nothing Found!" })
        : res.rows;
    });
};
