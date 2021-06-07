import express, { Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { checkPassword } from "./auth";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/auth/credentials", async (req, res) => {
  const { username, password } = req.body;
  const result = await checkPassword(username, password);

  // TODO: provide token(s) for the client to use
  return res.json({ success: false });
});

app.get("/auth/refresh", async (req, res) => {
  // TODO: check the request is authorized and provide token(s)
  return res.json({ success: false });
});

app.get("/api/whoami", (req, res) => {
  // TODO: check the request was authenticated, and display correct username
  const username = "TODO";
  res.json({ username });
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));
