=const express = require("express");
const router = require("./routes");

const app = express();

app.use(express.json());

app.use("/vehicle", router);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON" });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

module.exports = app;
