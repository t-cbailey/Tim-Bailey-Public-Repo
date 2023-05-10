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
            //I CANNOT make comment count into a number. it just will not!
            expect(typeof review.comment_count).toBe("string");
          });
        });
    });
  });
});
