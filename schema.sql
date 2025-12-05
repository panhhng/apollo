CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vin TEXT NOT NULL,
  manufacturer_name TEXT NOT NULL,
  description TEXT NOT NULL,
  horse_power INT NOT NULL,
  model_name TEXT NOT NULL,
  model_year INT NOT NULL,
  purchase_price NUMERIC NOT NULL,
  fuel_type TEXT NOT NULL
);

CREATE UNIQUE INDEX vin_ci_unique ON vehicles (LOWER(vin));
