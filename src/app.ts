import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();
const port = 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Assignment 2",
  });
});

app.use("/api/auth", authRoute);

export default app;
