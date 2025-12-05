function validateVehicle(v) {
  const errors = {};

  if (!v || typeof v !== "object") {
    return { body: "Request body must be a JSON object" };
  }

  if (!v.vin) errors.vin = "vin is required";
  if (!v.manufacturer_name) errors.manufacturer_name = "manufacturer_name is required";
  if (!v.description) errors.description = "description is required";
  if (!v.model_name) errors.model_name = "model_name is required";
  if (!v.fuel_type) errors.fuel_type = "fuel_type is required";

  if (typeof v.horse_power !== "number")
    errors.horse_power = "horse_power must be a number";

  if (typeof v.model_year !== "number")
    errors.model_year = "model_year must be a number";

  if (typeof v.purchase_price !== "number")
    errors.purchase_price = "purchase_price must be a number";

  return errors;
}

module.exports = { validateVehicle };
