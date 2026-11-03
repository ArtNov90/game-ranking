import "dotenv/config";
import express from "express";
import gamesRouter from "./routes/games";
import rawgRouter from "./routes/rawg";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/games", gamesRouter);
app.use("/api/rawg", rawgRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/games", gamesRouter);

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});