import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";
import globalErrorHandler from "./utility/globalErrorHandler";
import cors from "cors";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5000",
  }),
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Assignment 2",
  });
});

// routes
app.use("/api/auth", authRoute);
app.use("/api/issues", issueRoute);

// global error handler
app.use(globalErrorHandler);

export default app;
