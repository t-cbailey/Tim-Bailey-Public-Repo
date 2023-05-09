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
        console.log(res.body);
        expect(res.body.msg).toBe("Sorry can't find that!");
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
