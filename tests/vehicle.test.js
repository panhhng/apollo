const request = require("supertest");
const app = require("../src/app");
const { db } = require("../src/db");

beforeEach(async () => {
  await db.query("DELETE FROM vehicles");
});

afterAll(async () => {
  await db.end();
});

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

  test("Create vehicle successfully - 201 and can GET it", async () => {
    const body = {
      vin: "ABC123",
      manufacturer_name: "Honda",
      description: "Nice car",
      horse_power: 150,
      model_name: "Civic",
      model_year: 2020,
      purchase_price: 20000,
      fuel_type: "Gas",
    };

    const createRes = await request(app).post("/vehicle").send(body);
    expect(createRes.status).toBe(201);
    expect(createRes.body.vin).toBe("ABC123");

    const getRes = await request(app).get("/vehicle/ABC123");
    expect(getRes.status).toBe(200);
    expect(getRes.body.model_name).toBe("Civic");
  });

  test("GET non-existing VIN - 404", async () => {
    const res = await request(app).get("/vehicle/DOESNOTEXIST");
    expect(res.status).toBe(404);
  });

  test("Duplicate VIN - 422", async () => {
    const body = {
      vin: "DUP123",
      manufacturer_name: "Toyota",
      description: "First car",
      horse_power: 120,
      model_name: "Corolla",
      model_year: 2019,
      purchase_price: 15000,
      fuel_type: "Gas",
    };

    const first = await request(app).post("/vehicle").send(body);
    expect(first.status).toBe(201);

    const second = await request(app).post("/vehicle").send(body);
    expect(second.status).toBe(422);
    expect(second.body.errors).toBeDefined();
  });

  test("Delete vehicle - 204 then 404 on GET", async () => {
    const body = {
      vin: "DEL123",
      manufacturer_name: "Ford",
      description: "Truck",
      horse_power: 200,
      model_name: "F-150",
      model_year: 2021,
      purchase_price: 30000,
      fuel_type: "Gas",
    };

    await request(app).post("/vehicle").send(body);

    const delRes = await request(app).delete("/vehicle/DEL123");
    expect(delRes.status).toBe(204);

    const getRes = await request(app).get("/vehicle/DEL123");
    expect(getRes.status).toBe(404);
  });
});