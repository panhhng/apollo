import request from "supertest";
import app from "../src/app.js";

describe("Vehicle API", () => {

  test("Malformed JSON - 400", async () => {
    const res = await request(app)
      .post("/vehicle")
      .set("Content-Type", "application/json")
      .send("{bad json");

    expect(res.status).toBe(400);
  });

  test("Valid JSON but invalid fields - 422", async () => {
    const res = await request(app)
      .post("/vehicle")
      .send({ vin: "" });

    expect(res.status).toBe(422);
    expect(res.body.errors).toBeDefined();
  });
});
