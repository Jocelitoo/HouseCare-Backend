import express, { Request, Response } from "express";
import cors from "cors";
import { routes } from "./routes/indexRoutes";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "Hello world!" });
});

app.use(routes);

app.listen(7000, () => {
  console.log("Server started on localhost:7000");
});
