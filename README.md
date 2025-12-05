# Apollo Vehicle Service

---

## Features

- Full CRUD API for Vehicles  
- Case-insensitive unique VIN constraint  
- **400 Bad Request** for malformed JSON  
- **422 Unprocessable Entity** for validation errors  
- PostgreSQL schema + Node.js server  
- Jest + Supertest tests (no GUI tools)  
- Buildable + runnable via Unix command line  

---

## Requirements

- **Node.js** (v18+ recommended)  
- **PostgreSQL** (installed with Homebrew)  

---

## Installation

### 1. Install dependencies
```bash
npm install
```

### 2. Create the PostgreSQL database
```bash
createdb apollo
```

### 3. Load the schema
```bash
psql apollo < schema.sql
```

This creates the `vehicles` table and VIN uniqueness index.

---

## Running the Server
```bash
npm run dev
```

Server starts at:
```
http://localhost:3000
```

---

## Running Tests (Command Line)
```bash
npm test
```

Tests validate:

- Malformed JSON → **400**
- Invalid Vehicle structure → **422**
- Basic API behavior

No GUI tools required.

---

## API Documentation

### **GET /vehicle**
Returns all vehicles.
```bash
curl http://localhost:3000/vehicle
```

---

### **GET /vehicle/:vin**
Fetch a single vehicle (case-insensitive VIN).

- **404 Not Found** → if VIN doesn't exist

Example:
```bash
curl http://localhost:3000/vehicle/ABC123
```

---

### **POST /vehicle**
Create a vehicle.

Example request body:
```json
{
  "vin": "ABC123",
  "manufacturer_name": "Honda",
  "description": "Sedan",
  "horse_power": 150,
  "model_name": "Civic",
  "model_year": 2020,
  "purchase_price": 20000,
  "fuel_type": "Gas"
}
```

Errors:
- **400** → malformed JSON  
- **422** → missing/invalid fields  
- **422** → VIN already exists  

---

### **PUT /vehicle/:vin**
Update an existing vehicle.

- **404** → VIN not found  
- **422** → invalid body  

Example:
```bash
curl -X PUT http://localhost:3000/vehicle/ABC123   -H "Content-Type: application/json"   -d '{"vin":"ABC123","manufacturer_name":"Honda","description":"Updated","horse_power":160,"model_name":"Civic","model_year":2021,"purchase_price":21000,"fuel_type":"Gas"}'
```

---

### **DELETE /vehicle/:vin**
Deletes a vehicle.

Returns:
```
204 No Content
```

---

## Error Handling Rules

| Condition | HTTP Code |
|----------|-----------|
| JSON cannot be parsed | **400 Bad Request** |
| JSON is valid but fields invalid/missing | **422 Unprocessable Entity** |
| VIN not found | **404 Not Found** |
| VIN already exists | **422 Unprocessable Entity** |

---

## Project Structure
```
apollo-vehicle-service/
│
├── src/
│   ├── app.js          
│   ├── db.js          
│   ├── routes.js       
│   └── validate.js    
│
├── tests/
│   └── vehicle.test.js 
│
├── schema.sql         
├── package.json
├── README.md
└── .gitignore
```

---

## Database Schema

```sql
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
```

---

## Maintainer Notes

- Validation logic is isolated in `validate.js`
- Database connection is in `db.js`
- Routes are modular and mounted in `app.js`
- Tests do not require the server to be manually started
- Fully CLI-compatible (no IDE required)
