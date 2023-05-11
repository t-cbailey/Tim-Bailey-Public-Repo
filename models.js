const { checkExists } = require("./app_utils");
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

exports.findCommentsByRevID = (id) => {
  const table = "reviews";
  const column = "review_id";
  review_id = parseInt(id.review_id);

  return Promise.all([
    checkExists(table, column, review_id),
    connection.query(
      `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id FROM reviews 
  JOIN comments ON comments.review_id = reviews.review_id
  WHERE reviews.review_id = $1
  ORDER BY comments.created_at;`,
      [review_id]
    ),
  ]).then(([unusedCHKESTS, dbOutput]) => {
    return dbOutput.rows;
  });
};
