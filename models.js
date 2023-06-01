const { checkExists } = require("./app_utils");
const connection = require("./db/connection");

exports.selectCategories = () => {
  return connection.query(`SELECT * FROM categories;`).then((res) => {
    return res.rows;
  });
};

exports.selectReviews = (
  category,
  sort_by = "created_at",
  order_by = "ASC"
) => {
  const validSortQueries = [
    "owner",
    "title",
    "category",
    "view_img_url",
    "created_at",
    "votes",
    "designer",
    "review_id",
    "comment_count",
  ];
  const validOrderQueries = ["asc", "desc", "ASC", "DESC"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort_by query!" });
  }

  if (!validOrderQueries.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "Invalid order_by query!" });
  }

  const queryValues = [];
  let queryStr = `SELECT owner, title, category, review_img_url, reviews.created_at, reviews.votes, designer,reviews.review_id, COUNT (comments.review_id) AS comment_count FROM reviews
  LEFT JOIN comments ON reviews.review_id = comments.review_id
  `;

  if (category) {
    queryValues.push(category);
    queryStr += "WHERE category = $1 ";
  }

  queryStr += `
          GROUP BY reviews.review_id
      	  ORDER BY ${sort_by} ${order_by}
        `;

  return connection.query(queryStr, queryValues).then((res) => {
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

exports.postReviewComment = (id, data) => {
  const review_id = parseInt(id.review_id);
  const { author, body } = data;
  if (
    !data.hasOwnProperty("author") ||
    !data.hasOwnProperty("body") ||
    typeof data.body !== "string" ||
    Object.keys(data).length > 2
  ) {
    return Promise.reject({ status: 400, msg: "Unsupported body format" });
  } else {
    return connection
      .query(
        `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *`,
        [author, body, review_id]
      )
      .then((res) => {
        return res.rows;
      });
  }
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

exports.patchReviewVotes = (id, votes) => {
  if (!votes.hasOwnProperty("inc_votes") || Object.keys(votes).length > 1) {
    return Promise.reject({ status: 400, msg: "Unsupported body format" });
  } else {
    return Promise.all([
      checkExists("reviews", "review_id", id),
      connection.query(
        `UPDATE reviews
      SET votes = votes + $2
      WHERE review_id = $1 RETURNING *`,
        [id, votes.inc_votes]
      ),
    ]).then(([unusedCHKESTS, dbOutput]) => {
      return dbOutput.rows;
    });
  }
};

exports.removeComment = (id) => {
  return Promise.all([
    checkExists("comments", "comment_id", id),
    connection.query(`DELETE FROM comments WHERE comment_id = $1`, [id]),
  ]).then(([unusedCHKESTS, dbOutput]) => {
    return undefined;
  });
};
