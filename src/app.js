import express from "express";
import { router } from "./routes.js";

const app = express();
app.use(express.json());

// Routes
app.use("/vehicle", router);

// 400 Bad Request for malformed JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Malformed JSON" });
  }
  next(err);
});

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => console.log("Server running on port 3000"));
}
