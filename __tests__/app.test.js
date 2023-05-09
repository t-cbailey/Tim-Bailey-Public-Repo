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
    test("GET 404 when passed anything other than a number recieve invalid id number", () => {
      return request(app)
        .get("/api/reviews/cuppatea")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("ID must be a number");
        });
    });
    test("GET 404 when nothing is returned recieve not found", () => {
      return request(app)
        .get("/api/reviews/2000")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Invalid input!");
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
});