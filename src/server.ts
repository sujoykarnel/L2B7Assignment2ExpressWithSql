import express, { type Request, type Response } from "express";

const app = express();
const port = 5000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hellow World");
});

app.listen(port, () => {
  console.log(`Server is running at the port: ${port}`);
});
