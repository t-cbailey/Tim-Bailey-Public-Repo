\c nc_games_test
SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.review_id FROM reviews 
JOIN comments ON comments.review_id = reviews.review_id
WHERE reviews.review_id = 3
ORDER BY comments.created_at;