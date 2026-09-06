require("dotenv").config();
const express = require("express");
const { connectDb } = require("./connectDb");
const urlRouter = require("./routers/url");
const notFound = require("./middleware.js/notFound");
const errorHandlingMiddleWare = require("./middleware.js/error");
const cookieParser = require("cookie-parser");
const authRouter = require("./routers/auth");

const app = express();

const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/url", urlRouter);
app.use("/api/v1/auth", authRouter);
app.use(notFound);
app.use(errorHandlingMiddleWare);

async function start() {
  await connectDb(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}

start();
