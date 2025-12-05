const request = require("supertest");
const app = require("../src/app");

describe("Vehicle API", () => {
  test("Malformed JSON - 400", async () => {
    const res = await request(app)
      .post("/vehicle")
      .set("Content-Type", "application/json")
      .send("{bad json");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Malformed JSON");
  });

  test("Valid JSON but invalid fields - 422", async () => {
    const res = await request(app)
      .post("/vehicle")
      .send({ vin: "" });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });
});
