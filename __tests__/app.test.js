const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
  connection.end();
});

beforeEach(() => {
  return seed(data);
});

describe("App", () => {
  test("status 404- page not found for incorrect endpoint ", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Sorry can't find that!");
      });
  });

  describe("/api", () => {
    test("GET 200- responds with a list of endpoints in JSON", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          expect(typeof res).toBe("object");
        });
    });
  });

  describe("/api/categories", () => {
    test("GET 200- responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body.categories)).toBe(true);
          expect(res.body.categories.length).toBe(4);
          res.body.categories.forEach((category) => {
            expect(typeof category.slug).toBe("string");
            expect(typeof category.description).toBe("string");
          });
        });
    });
  });

  describe("/api/reviews", () => {
    test("GET 200- responds with an array of reviews objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews.length).toBe(13);
          res.body.reviews.forEach((review) => {
            expect(typeof review.owner).toBe("string");
            expect(typeof review.title).toBe("string");
            expect(typeof review.review_id).toBe("number");
            expect(typeof review.category).toBe("string");
            expect(typeof review.review_img_url).toBe("string");
            expect(typeof review.created_at).toBe("string");
            expect(typeof review.votes).toBe("number");
            expect(typeof review.designer).toBe("string");
            expect(typeof review.comment_count).toBe("string");
          });
        });
    });
    test("comments_count should count the correct number of comments for each review", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          expect(res.body.reviews[0].comment_count).toBe("0");
          expect(res.body.reviews[9].comment_count).toBe("3");
        });
    });
    test("results should be sorted according to created_at ASC ", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then((res) => {
          const arr = res.body.reviews;
          expect(arr).toBeSortedBy("created_at");
        });
    });

    describe("/api/reviews/:review_id", () => {
      test("GET 200- should respond with a review object, of the correct id ", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then((res) => {
            expect(typeof res.body.review[0]).toBe("object");

            expect(typeof res.body.review[0].review_id).toBe("number");
            expect(typeof res.body.review[0].title).toBe("string");
            expect(typeof res.body.review[0].category).toBe("string");
            expect(typeof res.body.review[0].designer).toBe("string");
            expect(typeof res.body.review[0].owner).toBe("string");
            expect(typeof res.body.review[0].review_body).toBe("string");
            expect(typeof res.body.review[0].review_img_url).toBe("string");
            expect(typeof res.body.review[0].created_at).toBe("string");
            expect(typeof res.body.review[0].votes).toBe("number");
          });
      });
      test("GET 400 when passed anything other than a number recieve invalid id number", () => {
        return request(app)
          .get("/api/reviews/cuppatea")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Input");
          });
      });
      test("GET 404 when nothing is returned recieve not found", () => {
        return request(app)
          .get("/api/reviews/2000")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Nothing Found!");
          });
      });

      describe("PATCH 202 /api/reviews/:review_id", () => {
        test("PATCH 202- updates the votes property of given review_id by amount specified", () => {
          const newVote = 1;
          const dataToSend = { inc_votes: newVote };
          return request(app)
            .patch("/api/reviews/1")
            .send(dataToSend)
            .expect(201)
            .then((res) => {
              expect(typeof res.body).toBe("object");
              expect(typeof res.body.review[0].review_id).toBe("number");
              expect(typeof res.body.review[0].title).toBe("string");
              expect(typeof res.body.review[0].category).toBe("string");
              expect(typeof res.body.review[0].designer).toBe("string");
              expect(typeof res.body.review[0].owner).toBe("string");
              expect(typeof res.body.review[0].review_body).toBe("string");
              expect(typeof res.body.review[0].review_img_url).toBe("string");
              expect(typeof res.body.review[0].created_at).toBe("string");
              expect(typeof res.body.review[0].votes).toBe("number");

              expect(res.body.review[0].votes).toBe(2);
            });
        });
        test("PATCH 404- when passed anything other than a number, recieve invalid id", () => {
          const newVote = 1;
          const dataToSend = { inc_votes: newVote };
          return request(app)
            .patch("/api/reviews/nonsense")
            .send(dataToSend)
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("Invalid Input");
            });
        });
        test("PATCH 404- when id is correct format but id does not exist return error", () => {
          const newVote = 1;
          const dataToSend = { inc_votes: newVote };
          return request(app)
            .patch("/api/reviews/2000")
            .send(dataToSend)
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("Resource not found");
            });
        });
        test("PATCH 400- incorrect body format- too much data", () => {
          const dataToSend = {
            inc_votes: 1,
            body: "bodytext",
          };
          return request(app)
            .patch("/api/reviews/1")
            .send(dataToSend)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Unsupported body format");
            });
        });
      });
    });
    describe("/api/reviews/:review_id/comments", () => {
      test("GET 200- should respond with an array of comments for the given review id.", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .then((res) => {
            expect(res.body.comments.length).toBe(3);
            res.body.comments.forEach((comment) => {
              expect(typeof comment.comment_id).toBe("number");
              expect(typeof comment.votes).toBe("number");
              expect(typeof comment.created_at).toBe("string");
              expect(typeof comment.author).toBe("string");
              expect(typeof comment.body).toBe("string");
              expect(typeof comment.review_id).toBe("number");
            });
          });
      });

      test("GET 200- array should be ordered by created_at ", () => {
        return request(app)
          .get("/api/reviews/2/comments")
          .expect(200)
          .then((res) => {
            const arr = res.body.comments;
            expect(arr).toBeSortedBy("created_at");
          });
      });

      test("GET 400- when passed anything other than a number, recieve invalid id", () => {
        return request(app)
          .get("/api/reviews/cuppatea/comments")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Input");
          });
      });
      test("GET 404- when id is correct format but id does not exist return error", () => {
        return request(app)
          .get("/api/reviews/2000/comments")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Resource not found");
          });
      });
      test("GET 200- when id is valid but has no comments, recieve empty array", () => {
        return request(app)
          .get("/api/reviews/1/comments")
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toEqual([]);
          });
      });
    });
    describe("/api/reviews/:review_id/comments", () => {
      test("POST 201- adds a comment to the database", () => {
        const commentData = {
          username: "mallionaire",
          body: "my review text",
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(commentData)
          .expect(201)
          .then((res) => {
            expect(res.body.commentData.length).toBe(1);
            expect(typeof res.body.commentData[0].body).toBe("string");
            expect(typeof res.body.commentData[0].votes).toBe("number");
            expect(typeof res.body.commentData[0].author).toBe("string");
            expect(typeof res.body.commentData[0].review_id).toBe("number");
            expect(typeof res.body.commentData[0].created_at).toBe("string");
          });
      });

      test("POST 404- incorrect username", () => {
        const commentData = {
          username: "timbo",
          body: "my review text",
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(commentData)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Review or user not found");
          });
      });
      test("POST 404- review_id not found", () => {
        const commentData = {
          username: "mallionaire",
          body: "my review text",
        };
        return request(app)
          .post("/api/reviews/2000/comments")
          .send(commentData)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Review or user not found");
          });
      });

      test("POST 400- review_id invalid", () => {
        const commentData = {
          username: "mallionaire",
          body: "my review text",
        };
        return request(app)
          .post("/api/reviews/nonsense/comments")
          .send(commentData)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid Input");
          });
      });
      test("POST 400- incorrect body format- too much data", () => {
        const commentData = {
          username: "mallionaire",
          body: "bodytext",
          extraProp1: "prop",
          extraProp2: "prop2",
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(commentData)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unsupported body format");
          });
      });
      test("POST 400- incorrect body format- wrong object keys", () => {
        const commentData = {
          nonsense: "mallion",
          morenonsense: 1,
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(commentData)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unsupported body format");
          });
      });
      test("POST 400- incorrect body format- wrong body type", () => {
        const commentData = {
          username: "mallionaire",
          body: 1,
        };
        return request(app)
          .post("/api/reviews/1/comments")
          .send(commentData)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Unsupported body format");
          });
      });
    });
    describe("/api/reviews (queries)", () => {
      test("GET 200- allows filtering by category", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then((res) => {
            expect(res.body.reviews.length).toBe(1);
            res.body.reviews.forEach((review) => {
              expect(review.category).toBe("dexterity");
            });
          });
      });
    });
    // test("GET 200- allows sorting by any column", () => {
    //   return request(app)
    //     .get("/api/reviews?sort_by=name")
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.body.reviews.length).toBe(13);
    //       expect(res.body.reviews).toBeSortedBy("name");
    //     });
    // });
  });
  describe("/api/comments", () => {
    describe("/api/comments/:comment_id", () => {
      test("DELETE 204 - should delete a comment with given comment_id and return no content", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204)
          .then(() => {
            return connection
              .query(`SELECT * FROM comments WHERE comment_id = 1`)
              .then(({ rowCount }) => {
                expect(rowCount).toBe(0);
              });
          });
      });
      test("GET 400 when passed anything other than a number", () => {
        return request(app)
          .delete("/api/comments/nonsense")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Invalid Input");
          });
      });
      test("GET 404 when id is correct but comment doesnt exist", () => {
        return request(app)
          .delete("/api/comments/2000")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Resource not found");
          });
      });
    });
  });
});
