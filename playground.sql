\c nc_games_test;

INSERT INTO comments (author, body) VALUES ($1, $2) RETURNING *;


-- SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id FROM reviews 
--   JOIN comments ON comments.review_id = reviews.review_id
--   WHERE reviews.review_id = 2
--   ORDER BY comments.created_at;