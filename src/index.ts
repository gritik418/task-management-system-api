import express from "express";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`App served at port: ${port}`);
});
