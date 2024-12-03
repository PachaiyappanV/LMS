import cors from "cors";
import dotenv from "dotenv";
import * as dynamoose from "dynamoose";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

/* ROUTE IMPORTS */

/* CONFIGURATIONS */
dotenv.config();
const isProduction = process.env.NODE_ENV === "production";
if (!isProduction) {
  dynamoose.aws.ddb.local();
}

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

/* ROUTES */
app.get("/", (req, res) => {
  res.send("Hello World");
});

/* SERVER */
const port = process.env.PORT || 3000;
if (!isProduction) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
