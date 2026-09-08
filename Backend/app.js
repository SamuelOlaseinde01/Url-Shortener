require("dotenv").config();
const express = require("express");
const { connectDb } = require("./connectDb");
const urlRouter = require("./routers/url");
const notFound = require("./middleware/notFound");
const errorHandlingMiddleWare = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routers/auth");

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/url", urlRouter);
app.use("/api/v1/auth", authRouter);
app.use(errorHandlingMiddleWare);
app.use(notFound);

async function start() {
  await connectDb(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

start();
