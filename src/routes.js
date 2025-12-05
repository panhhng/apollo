const express = require("express");
const { db } = require("./db");
const { validateVehicle } = require("./validate");

const router = express.Router();

// GET /vehicle
router.get("/", async (req, res) => {
  const r = await db.query("SELECT * FROM vehicles");
  res.json(r.rows);
});

// GET /vehicle/:vin
router.get("/:vin", async (req, res) => {
  const r = await db.query(
    "SELECT * FROM vehicles WHERE LOWER(vin)=LOWER($1)",
    [req.params.vin]
  );

  if (r.rows.length === 0) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json(r.rows[0]);
});

// POST /vehicle
router.post("/", async (req, res) => {
  const v = req.body;

  const errors = validateVehicle(v);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const r = await db.query(
      `INSERT INTO vehicles
       (vin, manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        v.vin,
        v.manufacturer_name,
        v.description,
        v.horse_power,
        v.model_name,
        v.model_year,
        v.purchase_price,
        v.fuel_type,
      ]
    );

    res.status(201).json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(422)
        .json({ errors: { vin: "VIN must be unique (case-insensitive)" } });
    }
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /vehicle/:vin
router.put("/:vin", async (req, res) => {
  const existing = await db.query(
    "SELECT * FROM vehicles WHERE LOWER(vin)=LOWER($1)",
    [req.params.vin]
  );

  if (!existing.rows.length) {
    return res.status(404).json({ error: "Not found" });
  }

  const v = req.body;
  const errors = validateVehicle(v);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  try {
    const r = await db.query(
      `UPDATE vehicles SET
         vin=$1,
         manufacturer_name=$2,
         description=$3,
         horse_power=$4,
         model_name=$5,
         model_year=$6,
         purchase_price=$7,
         fuel_type=$8
       WHERE LOWER(vin)=LOWER($9)
       RETURNING *`,
      [
        v.vin,
        v.manufacturer_name,
        v.description,
        v.horse_power,
        v.model_name,
        v.model_year,
        v.purchase_price,
        v.fuel_type,
        req.params.vin,
      ]
    );

    res.json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(422)
        .json({ errors: { vin: "VIN must be unique (case-insensitive)" } });
    }
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /vehicle/:vin
router.delete("/:vin", async (req, res) => {
  await db.query("DELETE FROM vehicles WHERE LOWER(vin)=LOWER($1)", [
    req.params.vin,
  ]);
  res.status(204).send();
});

module.exports = router;
