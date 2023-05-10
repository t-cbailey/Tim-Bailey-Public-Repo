\c nc_games_test

-- SELECT title, category, designer, owner, review_img_url, reviews.created_at, reviews.votes, comments.review_id FROM reviews
-- JOIN comments ON comments.review_id = reviews.review_id;


SELECT owner, title, category, review_img_url, reviews.created_at, reviews.votes, designer,reviews.review_id, COUNT (comments.review_id integer) AS comment_count FROM reviews
LEFT JOIN comments ON reviews.review_id = comments.review_id
GROUP BY reviews.review_id
ORDER BY reviews.created_at ASC;



-- SELECT review_id from reviews 
-- WHERE review_id = 2 ;
-- SELECT COUNT(review_id) AS total_reviews from reviews;
