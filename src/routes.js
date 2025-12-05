import express from "express";
import { db } from "./db.js";
import { validateVehicle } from "./validate.js";

export const router = express.Router();

router.get("/", async (req, res) => {
  const r = await db.query("SELECT * FROM vehicles");
  res.json(r.rows);
});

router.get("/:vin", async (req, res) => {
  const r = await db.query(
    "SELECT * FROM vehicles WHERE LOWER(vin)=LOWER($1)",
    [req.params.vin]
  );

  if (r.rows.length === 0)
    return res.status(404).json({ error: "Not found" });

  res.json(r.rows[0]);
});

router.post("/", async (req, res) => {
  const v = req.body;

  const errors = validateVehicle(v);
  if (Object.keys(errors).length > 0)
    return res.status(422).json({ errors });

  try {
    const r = await db.query(
      `INSERT INTO vehicles
      (vin, manufacturer_name, description, horse_power, model_name, model_year, purchase_price, fuel_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [
        v.vin, v.manufacturer_name, v.description, v.horse_power,
        v.model_name, v.model_year, v.purchase_price, v.fuel_type,
      ]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505")
      return res.status(422).json({ errors: { vin: "VIN must be unique" } });

    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:vin", async (req, res) => {
  const exists = await db.query(
    "SELECT * FROM vehicles WHERE LOWER(vin)=LOWER($1)",
    [req.params.vin]
  );

  if (!exists.rows.length)
    return res.status(404).json({ error: "Not found" });

  const v = req.body;

  const errors = validateVehicle(v);
  if (Object.keys(errors).length > 0)
    return res.status(422).json({ errors });

  try {
    const r = await db.query(
      `UPDATE vehicles SET
       vin=$1, manufacturer_name=$2, description=$3, horse_power=$4,
       model_name=$5, model_year=$6, purchase_price=$7, fuel_type=$8
       WHERE LOWER(vin)=LOWER($9)
       RETURNING *`,
      [
        v.vin, v.manufacturer_name, v.description, v.horse_power,
        v.model_name, v.model_year, v.purchase_price, v.fuel_type,
        req.params.vin
      ]
    );
    res.json(r.rows[0]);
  } catch (e) {
    if (e.code === "23505")
      return res.status(422).json({ errors: { vin: "VIN must be unique" } });

    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:vin", async (req, res) => {
  await db.query("DELETE FROM vehicles WHERE LOWER(vin)=LOWER($1)", [
    req.params.vin,
  ]);
  res.status(204).send();
});
